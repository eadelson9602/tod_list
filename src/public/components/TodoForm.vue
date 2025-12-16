<template>
  <div class="container">
    <h2>{{ editingTodo ? "✏️ Editar Tarea" : "➕ Nueva Tarea" }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Título *</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="Ej: Comprar leche"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Descripción</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="Agrega detalles sobre esta tarea..."
        ></textarea>
      </div>

      <div class="form-group">
        <div class="checkbox-group">
          <input id="completed" v-model="formData.completed" type="checkbox" />
          <label for="completed" style="margin: 0; cursor: pointer">
            Marcar como completada
          </label>
        </div>
      </div>

      <div>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? "Guardando..." : editingTodo ? "Actualizar" : "Crear" }}
        </button>
        <button
          v-if="editingTodo"
          type="button"
          class="btn btn-secondary"
          @click="handleCancel"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Todo, CreateTodoDto, UpdateTodoDto } from "../../../types/todo";

const props = defineProps<{
  todo: Todo | null;
}>();

const emit = defineEmits<{
  save: [data: CreateTodoDto | UpdateTodoDto];
  cancel: [];
}>();

const formData = ref<CreateTodoDto>({
  title: "",
  description: "",
  completed: false,
});

const saving = ref(false);
const editingTodo = ref<Todo | null>(null);

watch(
  () => props.todo,
  (newTodo) => {
    editingTodo.value = newTodo;
    if (newTodo) {
      formData.value = {
        title: newTodo.title,
        description: newTodo.description || "",
        completed: newTodo.completed,
      };
    } else {
      formData.value = {
        title: "",
        description: "",
        completed: false,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  saving.value = true;
  const data = {
    title: formData.value.title.trim(),
    description: formData.value.description?.trim() || "",
    completed: formData.value.completed,
  };

  emit("save", data);
  saving.value = false;

  // Limpiar formulario si no está editando
  if (!editingTodo.value) {
    formData.value = {
      title: "",
      description: "",
      completed: false,
    };
  }
};

const handleCancel = () => {
  emit("cancel");
};
</script>
