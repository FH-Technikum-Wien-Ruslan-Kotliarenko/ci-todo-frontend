<template>
<div class="todo-item" @click="done">
  <span :class="{done: todo.done}">{{ todo.name }}</span>
  <CheckmarkComponent :done="todo.done" />
</div>
</template>

<script>
import CheckmarkComponent from "@/components/icons/CheckmarkComponent.vue";

export default {
  name: "TodoComponent",
  components: {CheckmarkComponent},
  props: {
    todo: Object
  },
  methods: {
    done() {
      if (this.todo.done) {
        this.$emit('undone', this.todo.id);
      } else {
        this.$emit('done', this.todo.id);
      }
    }
  }
}
</script>

<style scoped>
.todo-item {
  width: 400px;
  padding: 10px 20px;
  margin: 10px;

  border: 1px solid grey;
  border-radius: 20px;

  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  background-color: #282828;
  transition: background-color 0.2s;
}

.todo-item:hover {
  background-color: #2c3e50;
}

.done {
  text-decoration: line-through;
  color: #5c5c5c;
}
</style>