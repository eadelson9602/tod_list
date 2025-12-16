<template>
  <li :class="['todo-item', { completed: todo.completed }]">
    <div class="todo-header">
      <h3 class="todo-title">{{ todo.title }}</h3>
      <div class="todo-actions">
        <button
          class="btn btn-success"
          :class="{ 'btn-secondary': todo.completed }"
          @click="handleToggle"
        >
          {{ todo.completed ? "↩️ Desmarcar" : "✅ Completar" }}
        </button>
        <button class="btn btn-primary" @click="handleEdit">✏️ Editar</button>
        <button class="btn btn-danger" @click="handleDelete">
          🗑️ Eliminar
        </button>
      </div>
    </div>
    <div v-if="todo.description" class="todo-description">
      {{ todo.description }}
    </div>
    <div class="todo-meta">
      <span v-if="todo.createdAt">
        Creado: {{ formatDate(todo.createdAt) }}
      </span>
      <span v-if="todo.updatedAt && todo.updatedAt !== todo.createdAt">
        Actualizado: {{ formatDate(todo.updatedAt) }}
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Todo } from "../../../types/todo";

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  edit: [todo: Todo];
  delete: [id: number];
  toggle: [todo: Todo];
}>();

const handleEdit = () => {
  emit("edit", props.todo);
};

const handleDelete = () => {
  if (props.todo.id) {
    emit("delete", props.todo.id);
  }
};

const handleToggle = () => {
  emit("toggle", props.todo);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
