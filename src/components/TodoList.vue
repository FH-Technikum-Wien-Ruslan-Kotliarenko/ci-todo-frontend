<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable vue/no-unused-vars -->
<template>
  <button @click="logout">Logout</button>
  <ul>
    <li>
      <TodoInput @new-todo="post" />
    </li>
    <li v-for="(todo, i) in todos">
      <TodoComponent :todo="todo"
            @done="done"
            @undone="undone"
      />
    </li>
  </ul>
</template>

<script>
import TodoComponent from "@/components/TodoComponent.vue";
import TodoInput from "@/components/TodoInput.vue";
import {logout, createTodo, doneTodo, readTodos, undoneTodo} from "@/api";

export default {
  name: "TodoList",
  components: {TodoInput, TodoComponent},
  data() {
    return {
      todos: []
    }
  },
  methods: {
    async getAll() {
      this.todos = await readTodos();
    },
    async post(name) {
      var todo = await createTodo(name);
      this.todos.push(todo);
    },
    async done(id) {
      var todo = await doneTodo(id);
      this.update(id, todo);
    },
    async undone(id) {
      var todo = await undoneTodo(id);
      this.update(id, todo);
    },
    async logout() {
      this.error = '';
      this.successMsg = '';
      try {
        await logout();
        this.successMsg = "Logged out successfully!";
      } catch(err) {
        this.error = err.response?.data?.error || "Logout failed";
      }
    },
    update(id, todo) {
      this.todos.forEach((value, i) => {
        if (value.id === id) {
          this.todos[i] = todo;
        }
      });
    }
  },
  created() {
    this.getAll();
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
</style>