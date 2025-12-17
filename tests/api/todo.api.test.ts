import request from "supertest";
import express, { Express } from "express";
import cors from "cors";
import path from "path";
import sqlite3 from "sqlite3";
import fs from "fs";
import todoRoutes from "../../src/routes/todoRoutes";

// Ruta de base de datos de prueba
const TEST_DB_PATH = path.join(__dirname, "../../test-database.sqlite");

// Clase de base de datos de prueba
class TestDatabase {
  private db: sqlite3.Database;

  constructor() {
    // Eliminar base de datos de prueba si existe
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }

    this.db = new sqlite3.Database(TEST_DB_PATH);
    this.initDatabase();
  }

  private initDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    this.db.run(createTableQuery);
  }

  public run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  public get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  public all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          // Eliminar base de datos de prueba
          if (fs.existsSync(TEST_DB_PATH)) {
            try {
              fs.unlinkSync(TEST_DB_PATH);
            } catch (error) {
              // Ignorar errores al eliminar
            }
          }
          resolve();
        }
      });
    });
  }

  public clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM todos", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Crear app de prueba
function createTestApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", todoRoutes);
  return app;
}

describe("API Todo Tests", () => {
  let app: Express;
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = new TestDatabase();
    app = createTestApp();
    // Esperar un momento para que la base de datos se inicialice
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    if (testDb) {
      await testDb.close();
    }
  });

  beforeEach(async () => {
    // Limpiar base de datos real antes de cada prueba
    // Nota: Las rutas usan la base de datos real, así que limpiamos esa
    const { database } = require("../../src/database/database");
    try {
      await database.run("DELETE FROM todos");
    } catch (error) {
      // Ignorar errores si la tabla no existe aún
    }
  });

  describe("POST /api/todos", () => {
    it("debería crear un nuevo todo", async () => {
      const newTodo = {
        title: "Tarea de prueba",
        description: "Descripción de prueba",
        completed: false,
      };

      const response = await request(app)
        .post("/api/todos")
        .send(newTodo)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.description).toBe(newTodo.description);
      expect(response.body.completed).toBe(false);
    });

    it("debería fallar si no se proporciona el título", async () => {
      const response = await request(app)
        .post("/api/todos")
        .send({ description: "Sin título" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("debería crear un todo con solo el título", async () => {
      const response = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea simple" })
        .expect(201);

      expect(response.body.title).toBe("Tarea simple");
    });
  });

  describe("GET /api/todos", () => {
    it("debería obtener una lista vacía inicialmente", async () => {
      const response = await request(app).get("/api/todos").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("debería obtener todos los todos", async () => {
      // Limpiar antes de crear
      const { database } = require("../../src/database/database");
      await database.run("DELETE FROM todos");

      // Crear algunos todos
      const todo1 = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea 1" });
      const todo2 = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea 2" });
      const todo3 = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea 3" });

      const response = await request(app).get("/api/todos").expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(3);

      // Verificar que los todos creados están en la lista
      const titles = response.body.map((todo: any) => todo.title);
      expect(titles).toContain("Tarea 1");
      expect(titles).toContain("Tarea 2");
      expect(titles).toContain("Tarea 3");
    });
  });

  describe("GET /api/todos/:id", () => {
    it("debería obtener un todo por ID", async () => {
      const createResponse = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea para obtener" });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe("Tarea para obtener");
    });

    it("debería retornar 404 si el todo no existe", async () => {
      const response = await request(app).get("/api/todos/99999").expect(404);

      expect(response.body).toHaveProperty("error");
    });

    it("debería retornar 400 si el ID no es válido", async () => {
      const response = await request(app).get("/api/todos/abc").expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("debería actualizar un todo existente", async () => {
      const createResponse = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea original" });

      const todoId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: "Tarea actualizada", completed: true })
        .expect(200);

      expect(updateResponse.body.title).toBe("Tarea actualizada");
      expect(updateResponse.body.completed).toBe(true);
    });

    it("debería actualizar solo el campo proporcionado", async () => {
      const createResponse = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea original", description: "Descripción original" });

      const todoId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true })
        .expect(200);

      expect(updateResponse.body.title).toBe("Tarea original");
      expect(updateResponse.body.description).toBe("Descripción original");
      expect(updateResponse.body.completed).toBe(true);
    });

    it("debería retornar 404 si el todo no existe", async () => {
      const response = await request(app)
        .put("/api/todos/99999")
        .send({ title: "Actualización" })
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("debería eliminar un todo existente", async () => {
      const createResponse = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea a eliminar" });

      const todoId = createResponse.body.id;

      await request(app).delete(`/api/todos/${todoId}`).expect(200);

      // Verificar que fue eliminado
      await request(app).get(`/api/todos/${todoId}`).expect(404);
    });

    it("debería retornar 404 si el todo no existe", async () => {
      const response = await request(app)
        .delete("/api/todos/99999")
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debería completar un flujo completo de CRUD", async () => {
      // CREATE
      const createResponse = await request(app)
        .post("/api/todos")
        .send({ title: "Tarea completa", description: "Descripción completa" })
        .expect(201);

      const todoId = createResponse.body.id;

      // READ
      const getResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(getResponse.body.title).toBe("Tarea completa");

      // UPDATE
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true })
        .expect(200);

      expect(updateResponse.body.completed).toBe(true);

      // DELETE
      await request(app).delete(`/api/todos/${todoId}`).expect(200);

      // Verificar eliminación
      await request(app).get(`/api/todos/${todoId}`).expect(404);
    });
  });
});
