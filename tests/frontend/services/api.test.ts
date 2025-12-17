import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { apiService } from "../../../src/public/services/api";
import type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
} from "../../../src/types/todo";

// Mock de fetch global
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("ApiService", () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAllTodos", () => {
    it("debería obtener todos los todos", async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          title: "Tarea 1",
          description: "Descripción 1",
          completed: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 2,
          title: "Tarea 2",
          description: "Descripción 2",
          completed: true,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      } as Response);

      const result = await apiService.getAllTodos();

      expect(fetch).toHaveBeenCalledWith("/api/todos");
      expect(result).toEqual(mockTodos);
    });

    it("debería lanzar un error si la respuesta no es exitosa", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(apiService.getAllTodos()).rejects.toThrow(
        "Error al obtener los todos"
      );
    });
  });

  describe("getTodoById", () => {
    it("debería obtener un todo por ID", async () => {
      const mockTodo: Todo = {
        id: 1,
        title: "Tarea",
        description: "Descripción",
        completed: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodo,
      } as Response);

      const result = await apiService.getTodoById(1);

      expect(fetch).toHaveBeenCalledWith("/api/todos/1");
      expect(result).toEqual(mockTodo);
    });

    it("debería lanzar un error si la respuesta no es exitosa", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(apiService.getTodoById(999)).rejects.toThrow(
        "Error al obtener el todo"
      );
    });
  });

  describe("createTodo", () => {
    it("debería crear un nuevo todo", async () => {
      const newTodo: CreateTodoDto = {
        title: "Nueva tarea",
        description: "Nueva descripción",
        completed: false,
      };

      const createdTodo: Todo = {
        id: 1,
        title: newTodo.title,
        description: newTodo.description,
        completed: newTodo.completed || false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => createdTodo,
      } as Response);

      const result = await apiService.createTodo(newTodo);

      expect(fetch).toHaveBeenCalledWith("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      expect(result).toEqual(createdTodo);
    });

    it("debería lanzar un error con el mensaje del servidor si falla", async () => {
      const newTodo: CreateTodoDto = {
        title: "",
        description: "Sin título",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "El título es requerido" }),
      } as Response);

      await expect(apiService.createTodo(newTodo)).rejects.toThrow(
        "El título es requerido"
      );
    });
  });

  describe("updateTodo", () => {
    it("debería actualizar un todo existente", async () => {
      const updateData: UpdateTodoDto = {
        title: "Tarea actualizada",
        completed: true,
      };

      const updatedTodo: Todo = {
        id: 1,
        title: "Tarea actualizada",
        description: "Descripción original",
        completed: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTodo,
      } as Response);

      const result = await apiService.updateTodo(1, updateData);

      expect(fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedTodo);
    });

    it("debería lanzar un error si el todo no existe", async () => {
      const updateData: UpdateTodoDto = {
        title: "Actualización",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Todo no encontrado" }),
      } as Response);

      await expect(apiService.updateTodo(999, updateData)).rejects.toThrow(
        "Todo no encontrado"
      );
    });
  });

  describe("deleteTodo", () => {
    it("debería eliminar un todo", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
      } as Response);

      await apiService.deleteTodo(1);

      expect(fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "DELETE",
      });
    });

    it("debería lanzar un error si el todo no existe", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Todo no encontrado" }),
      } as Response);

      await expect(apiService.deleteTodo(999)).rejects.toThrow(
        "Todo no encontrado"
      );
    });
  });
});
