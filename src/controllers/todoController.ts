import { Request, Response } from "express";
import { todoService } from "../services/todoService";
import { CreateTodoDto, UpdateTodoDto } from "../types/todo";

export class TodoController {
  // Crear un nuevo todo
  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTodoDto = req.body;

      if (!data.title || data.title.trim() === "") {
        res.status(400).json({ error: "El título es requerido" });
        return;
      }

      const todo = await todoService.createTodo(data);
      res.status(201).json(todo);
    } catch (error) {
      console.error("Error al crear todo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener todos los todos
  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await todoService.getAllTodos();
      res.status(200).json(todos);
    } catch (error) {
      console.error("Error al obtener todos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener un todo por ID
  async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const todo = await todoService.getTodoById(id);

      if (!todo) {
        res.status(404).json({ error: "Todo no encontrado" });
        return;
      }

      res.status(200).json(todo);
    } catch (error) {
      console.error("Error al obtener todo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Actualizar un todo
  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const data: UpdateTodoDto = req.body;
      const todo = await todoService.updateTodo(id, data);

      if (!todo) {
        res.status(404).json({ error: "Todo no encontrado" });
        return;
      }

      res.status(200).json(todo);
    } catch (error) {
      console.error("Error al actualizar todo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Eliminar un todo
  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const deleted = await todoService.deleteTodo(id);

      if (!deleted) {
        res.status(404).json({ error: "Todo no encontrado" });
        return;
      }

      res.status(200).json({ message: "Todo eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar todo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export const todoController = new TodoController();
