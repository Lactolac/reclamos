<template>
  <div class="container mt-5">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="username" id="username" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" id="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const handleLogin = async () => {
      await authStore.login(username.value, password.value);
      if (authStore.isAuthenticated()) {
        router.push({ name: 'Home' });
      } else {
        Swal.fire({
          title: 'Error',
          text: authStore.error,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    };

    return {
      username,
      password,
      handleLogin
    };
  }
};
</script>