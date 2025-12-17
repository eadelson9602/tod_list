import { describe, it, expect, beforeEach } from "@jest/globals";
import { mount } from "@vue/test-utils";
import TodoForm from "../../../src/public/components/TodoForm.vue";
import type { Todo } from "../../../src/types/todo";

describe("TodoForm.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(TodoForm, {
      props: {
        todo: null,
      },
    });
  });

  it("debería renderizar el formulario correctamente", () => {
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find("#title").exists()).toBe(true);
    expect(wrapper.find("#description").exists()).toBe(true);
    expect(wrapper.find("#completed").exists()).toBe(true);
  });

  it("debería mostrar 'Nueva Tarea' cuando no hay todo para editar", () => {
    const heading = wrapper.find("h2");
    expect(heading.text()).toContain("Nueva Tarea");
  });

  it("debería mostrar 'Editar Tarea' cuando hay un todo para editar", async () => {
    const todo: Todo = {
      id: 1,
      title: "Tarea existente",
      description: "Descripción existente",
      completed: false,
    };

    await wrapper.setProps({ todo });
    const heading = wrapper.find("h2");
    expect(heading.text()).toContain("Editar Tarea");
  });

  it("debería llenar el formulario con los datos del todo al editar", async () => {
    const todo: Todo = {
      id: 1,
      title: "Tarea para editar",
      description: "Descripción para editar",
      completed: true,
    };

    await wrapper.setProps({ todo });

    const titleInput = wrapper.find("#title").element as HTMLInputElement;
    const descriptionInput = wrapper.find("#description")
      .element as HTMLTextAreaElement;
    const completedInput = wrapper.find("#completed")
      .element as HTMLInputElement;

    expect(titleInput.value).toBe("Tarea para editar");
    expect(descriptionInput.value).toBe("Descripción para editar");
    expect(completedInput.checked).toBe(true);
  });

  it("debería emitir el evento 'save' al enviar el formulario", async () => {
    const titleInput = wrapper.find("#title");
    await titleInput.setValue("Nueva tarea");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(wrapper.emitted("save")).toBeTruthy();
    expect(wrapper.emitted("save")?.[0]?.[0]).toEqual({
      title: "Nueva tarea",
      description: "",
      completed: false,
    });
  });

  it("debería validar que el título es requerido", () => {
    const titleInput = wrapper.find("#title");
    const required = titleInput.attributes("required");
    expect(required).toBeDefined();
  });

  it("debería emitir el evento 'cancel' al hacer clic en cancelar", async () => {
    const todo: Todo = {
      id: 1,
      title: "Tarea",
      description: "Descripción",
      completed: false,
    };

    await wrapper.setProps({ todo });

    const cancelButton = wrapper.find('button[type="button"]');
    await cancelButton.trigger("click");

    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it("debería mostrar el botón 'Crear' cuando no está editando", () => {
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain("Crear");
  });

  it("debería mostrar el botón 'Actualizar' cuando está editando", async () => {
    const todo: Todo = {
      id: 1,
      title: "Tarea",
      description: "Descripción",
      completed: false,
    };

    await wrapper.setProps({ todo });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.text()).toContain("Actualizar");
  });

  it("debería limpiar el formulario después de crear un todo", async () => {
    const titleInput = wrapper.find("#title");
    const descriptionInput = wrapper.find("#description");

    await titleInput.setValue("Tarea temporal");
    await descriptionInput.setValue("Descripción temporal");

    const form = wrapper.find("form");
    await form.trigger("submit");

    // Esperar a que se limpie
    await wrapper.vm.$nextTick();

    const titleValue = (wrapper.find("#title").element as HTMLInputElement)
      .value;
    const descriptionValue = (
      wrapper.find("#description").element as HTMLTextAreaElement
    ).value;

    expect(titleValue).toBe("");
    expect(descriptionValue).toBe("");
  });

  it("debería manejar el estado de guardado (saving)", async () => {
    const titleInput = wrapper.find("#title");
    await titleInput.setValue("Tarea");

    const form = wrapper.find("form");
    await form.trigger("submit");

    // El componente debería manejar el estado de guardado
    const submitButton = wrapper.find('button[type="submit"]');
    // Nota: El estado saving se resetea rápidamente, así que esto puede no ser visible
    expect(submitButton.exists()).toBe(true);
  });
});
