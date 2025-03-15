import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'primeicons/primeicons.css';
// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Importar Bootstrap JS y Popper.js
import 'bootstrap/dist/js/bootstrap.bundle.min'

// Crear la aplicación y usar los plugins
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')