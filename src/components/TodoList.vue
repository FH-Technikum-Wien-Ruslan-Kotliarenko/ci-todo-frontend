<!-- TodoList.vue -->
<template>
  <div class="todo-list">
    <button class="logout-btn" @click="performLogout">Logout</button>
    
    <ul>
      <li>
        <TodoInput @new-todo="post" />
      </li>
      <li v-for="(todo) in sortedTodos" :key="todo.id">
        <TodoComponent :todo="todo"
              @done="done"
              @undone="undone"
        />
      </li>
    </ul>
    
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>
  </div>
</template>

<script>
import TodoComponent from "@/components/TodoComponent.vue";
import TodoInput from "@/components/TodoInput.vue";
import { logout, createTodo, doneTodo, readTodos, undoneTodo } from "@/api";
import posthog from "@/posthog";

export default {
  name: "TodoList",
  components: { TodoInput, TodoComponent },
  data() {
    return {
      todos: [],
      error: '',
      successMsg: '',
    }
  },
  emits: ['loggedOut'],
  computed: {
    sortedTodos() {
      // If feature toggling is off, just return `todos` as-is
      // If on, we do the fancy "unfinished => next day, finished => day done" logic
      // For demonstration, let's do something simple:
      
      const enabled = posthog.isFeatureEnabled('todo-sorting');
      if (!enabled) {
        return this.todos;
      }

      // Example logic:
      // 1) Group by "done" or "not done"
      // 2) For done items, keep them on their date (not tracked here, but we’d store a completedAt).
      // 3) For unfinished, assume they move to "today."
      // Simplify: just put undone items first, done items after => sorted by done status.
      const undone = this.todos.filter(t => !t.done);
      const done = this.todos.filter(t => t.done);

      // Return undone first, done later
      return [...undone, ...done];
    }
  },
  methods: {
    async getAll() {
      this.todos = await readTodos();
    },
    async post(name) {
      const todo = await createTodo(name);
      this.todos.push(todo);
    },
    async done(id) {
      const todo = await doneTodo(id);
      this.update(id, todo);
    },
    async undone(id) {
      const todo = await undoneTodo(id);
      this.update(id, todo);
    },
    async performLogout() {
      this.error = '';
      this.successMsg = '';
      try {
        await logout();
        this.successMsg = "Logged out successfully!";
        // tell parent we are now logged out
        this.$emit('loggedOut');
      } catch(err) {
        this.error = err.response?.data?.error || "Logout failed";
      }
    },
    update(id, updatedTodo) {
      this.todos = this.todos.map(t => (t.id === id ? updatedTodo : t));
    }
  },
  async created() {
    await this.getAll();
  }
}
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
}

.logout-btn {
  background-color: #c0392b;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  margin-bottom: 10px;
}

.error {
  color: red;
  text-align: center;
}
.success {
  color: green;
  text-align: center;
}
</style>
