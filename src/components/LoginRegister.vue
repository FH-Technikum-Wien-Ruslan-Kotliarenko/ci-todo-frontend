<!-- LoginRegister.vue -->
<template>
  <div class="auth-container">
    <!-- HEADLINE changes based on variant -->
    <h2>{{ headlineText }}</h2>
    <input v-model="regEmail" placeholder="Email" />
    <input v-model="regPassword" placeholder="Password" type="password" />
    <!-- REGISTER BUTTON changes color/text based on variant -->
    <button :class="registerBtnClass" @click="register">
      {{ registerBtnLabel }}
    </button>

    <h2>Login</h2>
    <input v-model="loginEmail" placeholder="Email" />
    <input v-model="loginPassword" placeholder="Password" type="password" />
    <button class="login-btn" @click="login">Login</button>
  
    <p class="error">{{ error }}</p>
    <p class="success">{{ successMsg }}</p>
  </div>
</template>

<script>
import { register, login } from "@/api";

import usePostHog from '@/usePostHog';

export default {
  data() {
    return {
      regEmail: '',
      regPassword: '',
      loginEmail: '',
      loginPassword: '',
      error: '',
      successMsg: '',

      // A/B test states
      variant: 'variantA', // default
      headlineText: 'Register', 
      registerBtnLabel: 'Register now!',
      registerBtnClass: 'register-btn-variantA'
    }
  },
  emits: ['loggedIn'],
  methods: {
    async register() {
      this.error = '';
      this.successMsg = '';
      try {
        await register(this.regEmail, this.regPassword);
        this.successMsg = "Registered successfully!";
      } catch(err) {
        this.error = err.response?.data?.error || "Registration failed";
      }
    },
    async login() {
      this.error = '';
      this.successMsg = '';
      try {
        await login(this.loginEmail, this.loginPassword);
        this.successMsg = "Logged in successfully!";
        
        // We can tell the parent we're now authenticated, so it can set isAuth = true
        this.$emit('loggedIn');
      } catch(err) {
        this.error = err.response?.data?.error || "Login failed";
      }
    }
  },
  async mounted() {
    const { posthog } = usePostHog();
    const abVariant = posthog.getFeatureFlag('register-button-variant');

    this.variant = abVariant;
    if (abVariant === 'variantB') {
      // Use a different headline & different button style
      this.headlineText = 'Sign Up Now!';
      this.registerBtnLabel = 'Sign Up';
      this.registerBtnClass = 'register-btn-variantB';
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}

/* Variant A styling */
.register-btn-variantA {
  background-color: blue;
  color: white;
  border: 1px solid #ccc;
  padding: 10px 20px;
}

/* Variant B styling */
.register-btn-variantB {
  background-color: green;
  color: white;
  border: 1px solid #ccc;
  padding: 10px 20px;
}

/* The login button can be a simpler style for now */
.login-btn {
  background-color: #222;
  color: #fff;
  padding: 10px 20px;
}
</style>
