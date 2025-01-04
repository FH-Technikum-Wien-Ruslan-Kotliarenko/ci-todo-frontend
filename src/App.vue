<!-- App.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {authMe} from '@/api';

import TodoList from "@/components/TodoList.vue";
import LoginRegister from "@/components/LoginRegister.vue";

axios.defaults.withCredentials = true;

const isAuth = ref(false);
const loading = ref(true);

onMounted(async () => {
  try {
    // Attempt to fetch /auth/me
    const authData = await authMe();
    if (authData?.userId) {
      // user is authenticated
      isAuth.value = true;
    }
  } catch (err) {
    // if 401 or any other error, user is not authenticated
    isAuth.value = false;
  }
  loading.value = false;
});
</script>

<template>
  <main>
    <!-- Show a simple loading spinner or text while checking auth -->
    <div v-if="loading">Checking authentication...</div>
    
    <!-- If not loading, conditionally render the correct component -->
    <div v-else>
      <TodoList v-if="isAuth" />
      <LoginRegister v-else />
    </div>
  </main>
</template>
