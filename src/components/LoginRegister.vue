<template>
    <div>
      <h2>Register</h2>
      <input v-model="regEmail" placeholder="Email" />
      <input v-model="regPassword" placeholder="Password" type="password" />
      <button @click="register">Register</button>
  
      <h2>Login</h2>
      <input v-model="loginEmail" placeholder="Email" />
      <input v-model="loginPassword" placeholder="Password" type="password" />
      <button @click="login">Login</button>
  
      <p style="color: red">{{ error }}</p>
      <p style="color: green">{{ successMsg }}</p>
    </div>
  </template>
  
  <script>
  import {register, login} from "@/api";
  
  export default {
    data() {
      return {
        regEmail: '',
        regPassword: '',
        loginEmail: '',
        loginPassword: '',
        error: '',
        successMsg: ''
      }
    },
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
        } catch(err) {
          this.error = err.response?.data?.error || "Login failed";
        }
      }
    }
  }
  </script>
  