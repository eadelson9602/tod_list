import { Router } from "express";
import { todoController } from "../controllers/todoController";

const router = Router();

// Rutas CRUD
router.post("/todos", (req, res) => todoController.createTodo(req, res));
router.get("/todos", (req, res) => todoController.getAllTodos(req, res));
router.get("/todos/:id", (req, res) => todoController.getTodoById(req, res));
router.put("/todos/:id", (req, res) => todoController.updateTodo(req, res));
router.delete("/todos/:id", (req, res) => todoController.deleteTodo(req, res));

export default router;
