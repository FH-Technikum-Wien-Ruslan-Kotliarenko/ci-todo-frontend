<!-- App.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { authMe } from '@/api';

import TodoList from "@/components/TodoList.vue";
import LoginRegister from "@/components/LoginRegister.vue";
import usePostHog from '@/usePostHog';

axios.defaults.withCredentials = true;

const { posthog } = usePostHog();

const isAuth = ref(false);
const loading = ref(true);
const error = ref('');
const successMsg = ref('');

// 1) On mount, we check if user is logged in
onMounted(async () => {
  try {
    const authData = await authMe();
    if (authData?.userId) {
      isAuth.value = true;
      posthog.identify(authData.userEmail);
    }
  } catch (err) {
    isAuth.value = false;
  }
  loading.value = false;
});

// 2) Handle "loggedIn" event from LoginRegister
function onLoggedIn() {
  isAuth.value = true;
  successMsg.value = 'You are now logged in!';
}

// 3) Handle "loggedOut" event from TodoList
function onLoggedOut() {
  isAuth.value = false;
  successMsg.value = 'You have logged out!';
}
</script>

<template>
  <main>
    <!-- Show a simple loading text while checking auth -->
    <div v-if="loading">Checking authentication...</div>
    
    <!-- If not loading, conditionally render the correct component -->
    <div v-else>
      <!-- Show success or error messages at top -->
      <div class="flash-messages">
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <TodoList 
        v-if="isAuth" 
        @loggedOut="onLoggedOut"
      />
      
      <LoginRegister 
        v-else 
        @loggedIn="onLoggedIn"
      />
    </div>
  </main>
</template>

<style scoped>
.flash-messages {
  text-align: center;
  margin: 10px 0;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
