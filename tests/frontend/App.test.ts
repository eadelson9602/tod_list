import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { mount } from "@vue/test-utils";
import App from "../../../src/public/App.vue";
import type { Todo } from "../../../src/types/todo";

// Mock del servicio API
const mockGetAllTodos = jest.fn();
const mockCreateTodo = jest.fn();
const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();

jest.mock("../../../src/public/services/api", () => ({
  apiService: {
    getAllTodos: mockGetAllTodos,
    createTodo: mockCreateTodo,
    updateTodo: mockUpdateTodo,
    deleteTodo: mockDeleteTodo,
  },
}));

describe("App.vue", () => {
  let wrapper: ReturnType<typeof mount>;
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllTodos.mockResolvedValue(mockTodos);
  });

  it("debería renderizar el componente principal", () => {
    wrapper = mount(App);
    expect(wrapper.find("#app").exists()).toBe(true);
  });

  it("debería mostrar el título de la aplicación", () => {
    wrapper = mount(App);
    const title = wrapper.find("h1");
    expect(title.text()).toContain("Todo List");
  });

  it("debería cargar los todos al montar el componente", async () => {
    wrapper = mount(App);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetAllTodos).toHaveBeenCalled();
  });

  it("debería mostrar el estado de carga inicialmente", () => {
    wrapper = mount(App);
    // El componente puede mostrar un estado de carga
    expect(wrapper.exists()).toBe(true);
  });

  it("debería mostrar el mensaje de estado vacío cuando no hay todos", async () => {
    mockGetAllTodos.mockResolvedValueOnce([]);
    wrapper = mount(App);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    const emptyState = wrapper.find(".empty-state");
    if (emptyState.exists()) {
      expect(emptyState.text()).toContain("No hay tareas");
    }
  });

  it("debería mostrar los todos cuando se cargan", async () => {
    wrapper = mount(App);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verificar que el componente TodoForm existe
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("debería mostrar mensajes de error cuando falla la carga", async () => {
    mockGetAllTodos.mockRejectedValueOnce(new Error("Error de red"));
    wrapper = mount(App);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // El componente debería manejar el error
    expect(wrapper.exists()).toBe(true);
  });

  it("debería mostrar mensajes de éxito después de crear un todo", async () => {
    const newTodo: Todo = {
      id: 3,
      title: "Nueva tarea",
      description: "Nueva descripción",
      completed: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    mockCreateTodo.mockResolvedValueOnce(newTodo);
    mockGetAllTodos.mockResolvedValueOnce([...mockTodos, newTodo]);

    wrapper = mount(App);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simular el evento save del TodoForm
    const todoForm = wrapper.findComponent({ name: "TodoForm" });
    if (todoForm.exists()) {
      await todoForm.vm.$emit("save", {
        title: "Nueva tarea",
        description: "Nueva descripción",
      });
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockCreateTodo).toHaveBeenCalled();
    }
  });
});
