<template>
  <div class="d-flex align-items-center justify-content-center vh-100">
    <div class="card custom-card-width shadow border-top-primary">
      <div class="card-body">
        <form @submit.prevent="processLogin" ref="loginForm">
          <div class="text-center mb-4">
            <img src="/src/assets/logo.png" style="height: 50px;" alt="Logo">
            <h2 class="mt-3 custom-text-color">Reclamos</h2>
            <p class="mt-3 custom-text-color">Ingrese sus credenciales</p>
          </div>
          <div class="mb-3">
            <input type="text" class="form-control" id="user" v-model="login.user" placeholder="Usuario" required>
          </div>
          <div class="mb-3">
            <input type="password" class="form-control" id="pass" v-model="login.pass" placeholder="Contraseña" required>
          </div>
          <button type="submit" class="btn btn-primary w-100 custom-button-color" :disabled="logging">
            <span v-if="logging" class="spinner-border spinner-border-sm"></span>
            <span v-else>Iniciar sesión</span>
          </button>
          <div v-if="loginMessage" class="mt-3">
            <div :class="['alert', messageAccent(loginSuccess)]" role="alert">
              {{ loginMessage }}
            </div>
          </div>
        </form>
      </div>
    </div>
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
    const login = ref({ user: '', pass: '' });
    const logging = ref(false);
    const loginMessage = ref('');
    const loginSuccess = ref(false);

    const processLogin = async () => {
      logging.value = true;
      loginMessage.value = '';
      try {
        await authStore.login(login.value.user, login.value.pass);
        if (authStore.isAuthenticated()) {
          loginSuccess.value = true;
          router.push({ name: 'Home' });
        } else {
          loginSuccess.value = false;
          loginMessage.value = authStore.error || 'Error desconocido';
          Swal.fire({
            title: 'Error',
            text: loginMessage.value,
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      } catch (error) {
        loginSuccess.value = false;
        loginMessage.value = 'Error de autenticación';
        Swal.fire({
          title: 'Error',
          text: loginMessage.value,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      } finally {
        logging.value = false;
      }
    };

    const messageAccent = (success) => {
      return success ? 'alert-success' : 'alert-danger';
    };

    return {
      login,
      logging,
      loginMessage,
      loginSuccess,
      processLogin,
      messageAccent
    };
  }
};
</script>
<style scoped>
.custom-card-width {
  width: 400px; /* Ajusta el ancho según tus necesidades */
}

/* Estilo para el borde superior azul */
.border-top-primary {
  border-top: 10px solid #003d7f; /* Línea azul con el color especificado */
}

/* Aplica el fondo bg-light a todo el body */
body {
  background-color: #f8fafc;
}

/* Estilo personalizado para el texto y el botón */
.custom-text-color {
  color: #1c3d5a;/* Color azul especificado */
}

.custom-button-color {
  background-color: #fa8500; /* Color azul especificado */
  border-color: #fa8500; /* Color azul especificado */
}

</style>