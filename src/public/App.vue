<template>
  <div id="app">
    <div class="container">
      <h1>📝 Todo List</h1>
      <p style="color: #888; margin-bottom: 20px">
        Gestiona tus tareas de manera eficiente
      </p>

      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>

      <TodoForm
        :todo="editingTodo"
        @save="handleSave"
        @cancel="handleCancel"
      />

      <div class="container" style="margin-top: 20px">
        <h2>Mis Tareas</h2>
        <div v-if="loading" class="loading">Cargando tareas...</div>
        <div v-else-if="todos.length === 0" class="empty-state">
          <p>📭 No hay tareas aún</p>
          <p>Crea tu primera tarea usando el formulario de arriba</p>
        </div>
        <ul v-else class="todo-list">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @edit="handleEdit"
            @delete="handleDelete"
            @toggle="handleToggle"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TodoForm from './components/TodoForm.vue';
import TodoItem from './components/TodoItem.vue';
import { apiService } from './services/api';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../../types/todo';

const todos = ref<Todo[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const editingTodo = ref<Todo | null>(null);

const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const showError = (message: string) => {
  errorMessage.value = message;
  setTimeout(clearMessages, 5000);
};

const showSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(clearMessages, 5000);
};

const loadTodos = async () => {
  loading.value = true;
  clearMessages();
  try {
    todos.value = await apiService.getAllTodos();
  } catch (error) {
    showError(
      error instanceof Error ? error.message : 'Error al cargar las tareas'
    );
  } finally {
    loading.value = false;
  }
};

const handleSave = async (data: CreateTodoDto | UpdateTodoDto) => {
  clearMessages();
  try {
    if (editingTodo.value) {
      // Actualizar
      await apiService.updateTodo(editingTodo.value.id!, data as UpdateTodoDto);
      showSuccess('Tarea actualizada correctamente');
    } else {
      // Crear
      await apiService.createTodo(data as CreateTodoDto);
      showSuccess('Tarea creada correctamente');
    }
    editingTodo.value = null;
    await loadTodos();
  } catch (error) {
    showError(
      error instanceof Error ? error.message : 'Error al guardar la tarea'
    );
  }
};

const handleCancel = () => {
  editingTodo.value = null;
  clearMessages();
};

const handleEdit = (todo: Todo) => {
  editingTodo.value = { ...todo };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDelete = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    return;
  }

  clearMessages();
  try {
    await apiService.deleteTodo(id);
    showSuccess('Tarea eliminada correctamente');
    await loadTodos();
  } catch (error) {
    showError(
      error instanceof Error ? error.message : 'Error al eliminar la tarea'
    );
  }
};

const handleToggle = async (todo: Todo) => {
  clearMessages();
  try {
    await apiService.updateTodo(todo.id!, {
      completed: !todo.completed,
    });
    await loadTodos();
  } catch (error) {
    showError(
      error instanceof Error
        ? error.message
        : 'Error al actualizar el estado de la tarea'
    );
  }
};

onMounted(() => {
  loadTodos();
});
</script>
