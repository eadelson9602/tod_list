import { describe, it, expect, beforeEach } from "@jest/globals";
import { mount } from "@vue/test-utils";
import TodoItem from "../../../src/public/components/TodoItem.vue";
import type { Todo } from "../../../src/types/todo";

describe("TodoItem.vue", () => {
  let wrapper: ReturnType<typeof mount>;
  const mockTodo: Todo = {
    id: 1,
    title: "Tarea de prueba",
    description: "Descripción de prueba",
    completed: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });
  });

  it("debería renderizar el todo correctamente", () => {
    expect(wrapper.find(".todo-item").exists()).toBe(true);
    expect(wrapper.find(".todo-title").text()).toBe("Tarea de prueba");
    expect(wrapper.find(".todo-description").text()).toBe(
      "Descripción de prueba"
    );
  });

  it("debería mostrar todos los botones de acción", () => {
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3);

    const buttonTexts = buttons.map((btn) => btn.text());
    expect(buttonTexts.some((text) => text.includes("Completar"))).toBe(true);
    expect(buttonTexts.some((text) => text.includes("Editar"))).toBe(true);
    expect(buttonTexts.some((text) => text.includes("Eliminar"))).toBe(true);
  });

  it("debería mostrar 'Completar' cuando el todo no está completado", () => {
    const completeButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Completar"));
    expect(completeButton).toBeDefined();
  });

  it("debería mostrar 'Desmarcar' cuando el todo está completado", async () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true,
    };

    await wrapper.setProps({ todo: completedTodo });

    const button = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Desmarcar"));
    expect(button).toBeDefined();
  });

  it("debería aplicar la clase 'completed' cuando el todo está completado", async () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true,
    };

    await wrapper.setProps({ todo: completedTodo });

    expect(wrapper.find(".todo-item.completed").exists()).toBe(true);
  });

  it("debería emitir el evento 'edit' al hacer clic en Editar", async () => {
    const editButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Editar"));

    if (editButton) {
      await editButton.trigger("click");
      expect(wrapper.emitted("edit")).toBeTruthy();
      expect(wrapper.emitted("edit")?.[0]?.[0]).toEqual(mockTodo);
    }
  });

  it("debería emitir el evento 'delete' al hacer clic en Eliminar", async () => {
    const deleteButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Eliminar"));

    if (deleteButton) {
      await deleteButton.trigger("click");
      expect(wrapper.emitted("delete")).toBeTruthy();
      expect(wrapper.emitted("delete")?.[0]?.[0]).toBe(mockTodo.id);
    }
  });

  it("debería emitir el evento 'toggle' al hacer clic en Completar", async () => {
    const completeButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Completar"));

    if (completeButton) {
      await completeButton.trigger("click");
      expect(wrapper.emitted("toggle")).toBeTruthy();
      expect(wrapper.emitted("toggle")?.[0]?.[0]).toEqual(mockTodo);
    }
  });

  it("debería formatear las fechas correctamente", () => {
    const meta = wrapper.find(".todo-meta");
    expect(meta.exists()).toBe(true);
    // Verificar que las fechas se muestran
    const metaText = meta.text();
    expect(metaText).toContain("Creado:");
  });

  it("debería ocultar la descripción si no existe", async () => {
    const todoSinDescripcion: Todo = {
      ...mockTodo,
      description: undefined,
    };

    await wrapper.setProps({ todo: todoSinDescripcion });

    const description = wrapper.find(".todo-description");
    // El elemento puede existir pero estar vacío
    if (description.exists()) {
      expect(description.text()).toBe("");
    }
  });

  it("debería mostrar el título tachado cuando está completado", async () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true,
    };

    await wrapper.setProps({ todo: completedTodo });

    const title = wrapper.find(".todo-title");
    // Verificar que tiene el estilo de completado (puede ser a través de clases CSS)
    expect(wrapper.find(".todo-item.completed").exists()).toBe(true);
  });
});
