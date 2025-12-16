import { database } from "../database/database";
import { Todo, CreateTodoDto, UpdateTodoDto } from "../types/todo";

export class TodoService {
  // Crear un nuevo todo
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const { title, description, completed = false } = data;

    const sql = `
      INSERT INTO todos (title, description, completed, createdAt, updatedAt)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await database.run(sql, [
      title,
      description || null,
      completed ? 1 : 0,
    ]);

    const newTodo = await this.getTodoById(result.lastID!);
    if (!newTodo) {
      throw new Error("Error al crear el todo");
    }

    return newTodo;
  }

  // Obtener todos los todos
  async getAllTodos(): Promise<Todo[]> {
    const sql = "SELECT * FROM todos ORDER BY createdAt DESC";
    const rows = await database.all<any>(sql);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  // Obtener un todo por ID
  async getTodoById(id: number): Promise<Todo | null> {
    const sql = "SELECT * FROM todos WHERE id = ?";
    const row = await database.get<any>(sql, [id]);

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  // Actualizar un todo
  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo | null> {
    const todo = await this.getTodoById(id);
    if (!todo) {
      return null;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }

    if (data.completed !== undefined) {
      updates.push("completed = ?");
      values.push(data.completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return todo;
    }

    updates.push("updatedAt = datetime('now')");
    values.push(id);

    const sql = `UPDATE todos SET ${updates.join(", ")} WHERE id = ?`;
    await database.run(sql, values);

    return await this.getTodoById(id);
  }

  // Eliminar un todo
  async deleteTodo(id: number): Promise<boolean> {
    const todo = await this.getTodoById(id);
    if (!todo) {
      return false;
    }

    const sql = "DELETE FROM todos WHERE id = ?";
    await database.run(sql, [id]);

    return true;
  }
}

export const todoService = new TodoService();
