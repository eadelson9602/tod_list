import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import todoRoutes from "./routes/todoRoutes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use("/api", todoRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "public");
  app.use(express.static(publicPath));

  // Todas las rutas que no sean /api deben servir el index.html
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
} else {
  // En desarrollo, solo mostrar info de la API
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "API de Todo List funcionando correctamente",
      endpoints: {
        "GET /api/todos": "Obtener todos los todos",
        "GET /api/todos/:id": "Obtener un todo por ID",
        "POST /api/todos": "Crear un nuevo todo",
        "PUT /api/todos/:id": "Actualizar un todo",
        "DELETE /api/todos/:id": "Eliminar un todo",
      },
      note: "En desarrollo, el frontend se ejecuta en http://localhost:5173",
    });
  });
}

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 API disponible en http://localhost:${PORT}/api`);
});
