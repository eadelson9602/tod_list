import type { Todo, CreateTodoDto, UpdateTodoDto } from '../../types/todo';

const API_BASE_URL = '/api';

export class ApiService {
  // Obtener todos los todos
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Error al obtener los todos');
    }
    return response.json() as Promise<Todo[]>;
  }

  // Obtener un todo por ID
  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el todo');
    }
    return response.json() as Promise<Todo>;
  }

  // Crear un nuevo todo
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = (await response.json()) as { error?: string };
      throw new Error(error.error || 'Error al crear el todo');
    }
    return response.json() as Promise<Todo>;
  }

  // Actualizar un todo
  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = (await response.json()) as { error?: string };
      throw new Error(error.error || 'Error al actualizar el todo');
    }
    return response.json() as Promise<Todo>;
  }

  // Eliminar un todo
  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = (await response.json()) as { error?: string };
      throw new Error(error.error || 'Error al eliminar el todo');
    }
  }
}

export const apiService = new ApiService();
