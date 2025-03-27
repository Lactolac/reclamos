<template>
  <div v-if="isAuthorized" class="container mt-5 px-3 position-relative">
    <div class="text-center mb-4">
      <img
        src="../assets/logo.png"
        alt="Logo"
        class="img-fluid"
        style="max-width: 150px"
      />
    </div>
    <button
      type="button"
      class="btn btn-danger position-absolute top-0 end-0 m-3"
      @click="handleLogout"
    >
      Salir <i class="pi pi-sign-out"></i>
    </button>
    <h4 class="text-center mb-4">Formulario de Reclamo</h4>

    <!-- Inician datos generales -->
    <form @submit.prevent="handleSubmit">
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="fechaHora" class="form-label">Fecha y Hora</label>
          <input
            v-model="form.fechaHora"
            type="text"
            class="form-control readonly-field"
            id="fechaHora"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="noReclamo" class="form-label"
            >No. de Reclamo <span class="text-danger">*</span></label
          >
          <div class="input-group">
            <input
              v-model="form.noReclamo"
              type="text"
              class="form-control"
              id="noReclamo"
              :disabled="!isEditable"
              :class="{ 'is-invalid': !form.noReclamo && isSubmitted }"
              @keypress="handleKeyPress"
              required
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="enableEditing"
            >
              ...
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="fetchReclamo"
            >
              <i class="pi pi-search"></i>
            </button>
          </div>
          <div v-if="!form.noReclamo && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="creadoPor" class="form-label">Creado por</label>
          <input
            v-model="form.creadoPor"
            type="text"
            class="form-control readonly-field"
            id="creadoPor"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="estatus" class="form-label">Estatus</label>
          <input
            v-model="form.estatus"
            type="text"
            class="form-control readonly-field"
            id="estatus"
            readonly
          />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="paisOrigen" class="form-label"
            >País de Origen <span class="text-danger">*</span></label
          >
          <select
            v-model="form.paisOrigen"
            class="form-control"
            id="paisOrigen"
            :class="{ 'is-invalid': !form.paisOrigen && isSubmitted }"
            required
          >
            <option
              v-for="pais in paisOptions"
              :key="pais.pais"
              :value="pais.pais"
            >
              {{ pais.pais }}
            </option>
          </select>
          <div v-if="!form.paisOrigen && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="col-md-6">
          <label for="rutaCliente" class="form-label"
            >Ruta Cliente <span class="text-danger">*</span></label
          >
          <select
            v-model="form.rutaCliente"
            class="form-control"
            id="rutaCliente"
            :class="{ 'is-invalid': !form.rutaCliente && isSubmitted }"
            required
          >
            <option
              v-for="ruta in rutaOptions"
              :key="ruta.ruta"
              :value="ruta.ruta"
            >
              {{ ruta.ruta }}
            </option>
          </select>
          <div v-if="!form.rutaCliente && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="contacto" class="form-label"
            >Contacto <span class="text-danger">*</span></label
          >
          <input
            v-model="form.contacto"
            type="text"
            class="form-control"
            id="contacto"
            :class="{ 'is-invalid': !form.contacto && isSubmitted }"
            required
          />
          <div v-if="!form.contacto && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="col-md-6">
          <label for="telefono" class="form-label"
            >Teléfono <span class="text-danger">*</span></label
          >
          <input
            v-model="form.telefono"
            type="text"
            class="form-control"
            id="telefono"
            :class="{ 'is-invalid': !form.telefono && isSubmitted }"
            required
          />
          <div v-if="!form.telefono && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
      </div>

      <!-- Inicia productos -->
      <div class="col-md-6">
        <label for="familiaProducto" class="form-label"
          >Familia de Producto <span class="text-danger">*</span></label
        >
        <select
          v-model="form.familiaProducto"
          class="form-control"
          id="familiaProducto"
          @change="filterProductosByFamilia"
          :class="{ 'is-invalid': !form.familiaProducto && isSubmitted }"
          required
        >
          <option
            v-for="familia in familiaOptions"
            :key="familia.familia"
            :value="familia.familia"
          >
            {{ familia.familia }}
          </option>
        </select>
        <div
          v-if="!form.familiaProducto && isSubmitted"
          class="invalid-feedback"
        >
          Este campo es obligatorio.
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="producto" class="form-label"
            >Producto <span class="text-danger">*</span></label
          >
          <select
            v-model="form.producto"
            class="form-control"
            id="producto"
            :class="{ 'is-invalid': !form.producto && isSubmitted }"
            required
          >
            <option
              v-for="producto in filteredProductos"
              :key="producto.producto"
              :value="producto.producto"
            >
              {{ producto.producto }}
            </option>
          </select>
          <div v-if="!form.producto && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="col-md-6">
          <label for="cantidad" class="form-label"
            >Cantidad <span class="text-danger">*</span></label
          >
          <input
            v-model="form.cantidad"
            type="text"
            class="form-control"
            id="cantidad"
            :class="{ 'is-invalid': !form.cantidad && isSubmitted }"
            required
          />
          <div v-if="!form.cantidad && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="uniMed" class="form-label"
            >Unidad de Medida <span class="text-danger">*</span></label
          >
          <select
            v-model="form.uniMed"
            class="form-control"
            id="uniMed"
            :class="{ 'is-invalid': !form.uniMed && isSubmitted }"
            required
          >
            <option
              v-for="uniMed in uniMedOptions"
              :key="uniMed.uni_med"
              :value="uniMed.uni_med"
            >
              {{ uniMed.uni_med }}
            </option>
          </select>
          <div v-if="!form.uniMed && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="col-md-6">
          <label for="noLote" class="form-label"
            >No. de Lote <span class="text-danger">*</span></label
          >
          <input
            v-model="form.noLote"
            type="text"
            class="form-control"
            id="noLote"
            :class="{ 'is-invalid': !form.noLote && isSubmitted }"
            required
          />
          <div v-if="!form.noLote && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="col-md-6">
          <label for="vencimiento" class="form-label"
            >Fecha de Vencimiento</label
          >
          <input
            v-model="form.vencimiento"
            type="date"
            class="form-control"
            id="vencimiento"
          />
        </div>
      </div>

      <!-- Inicia razon del reclamo -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="tipoOrigen" class="form-label"
            >Tipo <span class="text-danger">*</span></label
          >
          <select
            v-model="form.tipoOrigen"
            class="form-control"
            id="tipoOrigen"
            :class="{ 'is-invalid': !form.tipoOrigen && isSubmitted }"
            required
          >
            <option
              v-for="tipo in tipoOptions"
              :key="tipo.tipo"
              :value="tipo.tipo"
            >
              {{ tipo.tipo }}
            </option>
          </select>
          <div v-if="!form.tipoOrigen && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="col-md-6">
          <label for="razon" class="form-label"
            >Razon <span class="text-danger">*</span></label
          >
          <select
            v-model="form.razon"
            class="form-control"
            id="categoria"
            :class="{ 'is-invalid': !form.razon && isSubmitted }"
            required
          >
            <option
              v-for="categoria in categoriaOptions"
              :key="categoria"
              :value="categoria"
            >
              {{ categoria }}
            </option>
          </select>
          <div v-if="!form.razon && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="mb-3">
          <label for="descripcion" class="form-label"
            >Descripción del Reclamo <span class="text-danger">*</span></label
          >
          <select
            v-model="form.descripcion"
            class="form-control"
            id="descripcion"
            :class="{ 'is-invalid': !form.descripcion && isSubmitted }"
            required
          >
            <option
              v-for="reclamo in filteredReclamoOptions"
              :key="reclamo.reclamo"
              :value="reclamo.reclamo"
            >
              {{ reclamo.reclamo }}
            </option>
          </select>
          <div v-if="!form.descripcion && isSubmitted" class="invalid-feedback">
            Este campo es obligatorio.
          </div>
        </div>
        <div class="mb-3">
          <label for="areaResponsable" class="form-label"
            >Área Responsable <span class="text-danger">*</span></label
          >
          <select
            v-model="form.areaResponsable"
            class="form-control"
            id="areaResponsable"
            :class="{ 'is-invalid': !form.areaResponsable && isSubmitted }"
            required
          >
            <option
              v-for="area in areaOptions"
              :key="area.area"
              :value="area.area"
            >
              {{ area.area }}
            </option>
          </select>
          <div
            v-if="!form.areaResponsable && isSubmitted"
            class="invalid-feedback"
          >
            Este campo es obligatorio.
          </div>
        </div>
      </div>

      <!-- Inician comentarios -->
      <div class="mb-3">
        <label for="comentario" class="form-label"
          >Comentario <span class="text-danger">*</span></label
        >
        <textarea
          v-model="form.comentario"
          class="form-control"
          id="comentario"
          rows="3"
          :class="{ 'is-invalid': !form.comentario && isSubmitted }"
          required
        ></textarea>
        <div v-if="!form.comentario && isSubmitted" class="invalid-feedback">
          Este campo es obligatorio.
        </div>
      </div>

      <!-- Campo para subir una foto -->
      <div class="mb-3">
        <label for="foto" class="form-label"
          >Subir Foto</label
        >
        <input
          type="file"
          class="form-control"
          id="foto"
          @change="handleFileChange"
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="btn btn-primary me-4"
          @click="isSubmitted = true"
        >
          Guardar
        </button>
        <button type="button" class="btn btn-secondary" @click="handleClear">
          Limpiar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import router from "../router";
import axios from "axios";
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const isAuthorized = ref(false);
const isSubmitted = ref(false);
const isEditable = ref(false);
const form = ref({
  fechaHora: "",
  creadoPor: "",
  noReclamo: "", // Número de reclamo inicializado vacío
  estatus: "ABIERTO", // Estado por defecto
  paisOrigen: "",
  rutaCliente: "",
  talonario: "",
  contacto: "",
  telefono: "",
  producto: "",
  cantidad: "",
  uniMed: "",
  tipoOrigen: "",
  razon: "",
  familiaProducto: "",
  noLote: "",
  vencimiento: "",
  descripcion: "",
  areaResponsable: "",
  comentario: "",
});
const foto = ref(null);

const productos = ref([]);
const filteredProductos = ref([]);
const estatusOptions = ref([]);
const paisOptions = ref([]);
const rutaOptions = ref([]);
const tipoOptions = ref([]);
const categoriaOptions = ref(['CALIDAD', 'SERVICIO', 'IMAGEN', 'LEGALIDAD', 'INOCUIDAD']);
const familiaOptions = ref([]);
const areaOptions = ref([]);
const reclamoOptions = ref([
  { reclamo: "DEFORMACIONES DEL PRODUCTO -CA", categoria: 'CALIDAD' },
  { reclamo: "PRESENCIA DE HONGO -CA", categoria: 'CALIDAD' },
  { reclamo: "PRODUCTO FUERA DE ESPECIFICACION  -CA", categoria: 'CALIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (COLOR) -CA", categoria: 'CALIDAD' },
  { reclamo: "EMPAQUE  CON PERFORACIONES O RASGADURAS -CA", categoria: 'CALIDAD' },
  { reclamo: "INSECTO/ PARTES DE INSECTO -CA", categoria: 'CALIDAD' },
  { reclamo: "PRODUCTO INFLADO -CA", categoria: 'CALIDAD' },
  { reclamo: "FALLA EN SELLO DE EMBALAJE -CA", categoria: 'CALIDAD' },
  { reclamo: "FALLA EN SELLOS DEL EMPAQUE PRIMARIO -CA", categoria: 'CALIDAD' },
  { reclamo: "PROBLEMAS DE IMPRESIÓN EN EMPAQUE -CA", categoria: 'CALIDAD' },
  { reclamo: "SUCIEDAD O MANCHAS EN EMBALAJE, EMPAQUE O PROD -CA", categoria: 'CALIDAD' },
  { reclamo: "PERDIDA DE VACIO -CA", categoria: 'CALIDAD' },
  { reclamo: "PRODUCTO COMPACTADO -CA", categoria: 'CALIDAD' },
  { reclamo: "TEMPERATURA DEL PRODUCTO -CA", categoria: 'CALIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (OLOR) -CA", categoria: 'CALIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (SABOR) -CA", categoria: 'CALIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (TEXTURA) -CA", categoria: 'CALIDAD' },
  { reclamo: "PARTICULA O CUERPO EXTRAÑO -CA", categoria: 'CALIDAD' },
  { reclamo: "PROBLEMAS DE INOCUIDAD -CA", categoria: 'CALIDAD' },
  { reclamo: "PERDIDA DE LA CADENA DE FRIO -CA", categoria: 'CALIDAD' },
  { reclamo: "ESTADO DEL VEHICULO -SE", categoria: 'SERVICIO' },
  { reclamo: "IMPRUDENCIA -SE", categoria: 'SERVICIO' },
  { reclamo: "LLEGADA TARDE -SE", categoria: 'SERVICIO' },
  { reclamo: "MAL SERVICIO EN LA ENTREGA -SE", categoria: 'SERVICIO' },
  { reclamo: "MAL SERVICIO EN ATENCION AL CLIENTE -SE", categoria: 'SERVICIO' },
  { reclamo: "VENDEDOR / ENTREGADOR FUE GROSERO -SE", categoria: 'SERVICIO' },
  { reclamo: "PRESENTACION DEL PERSONAL / UNIFORME -SE", categoria: 'SERVICIO' },
  { reclamo: "INCUMPLIMIENTO DE VIDA UTIL -LE", categoria: 'LEGALIDAD' },
  { reclamo: "MENOR CONTENIDO POR UNIDAD -LE", categoria: 'LEGALIDAD' },
  { reclamo: "REGISTRO SANITARIO -LE", categoria: 'LEGALIDAD' },
  { reclamo: "REQUISITOS DE LEY -LE", categoria: 'LEGALIDAD' },
  { reclamo: "UNIDADES DE MENOS -LE", categoria: 'LEGALIDAD' },
  { reclamo: "UNIDADES INVERTIDAS -LE", categoria: 'LEGALIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (OLOR) -IN", categoria: 'INOCUIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (SABOR) -IN", categoria: 'INOCUIDAD' },
  { reclamo: "PERDIDA DE CALIDAD (TEXTURA) -IN", categoria: 'INOCUIDAD' },
  { reclamo: "PARTICULA O CUERPO EXTRAÑO -IN", categoria: 'INOCUIDAD' },
  { reclamo: "PROBLEMAS DE INOCUIDAD -IN", categoria: 'INOCUIDAD' },
  { reclamo: "PERDIDA DE LA CADENA DE FRIO -IN", categoria: 'INOCUIDAD' },
  { reclamo: "TEMPERATURA DEL PRODUCTO -IN", categoria: 'INOCUIDAD' },
  { reclamo: "DEFORMACIONES DEL EMPAQUE PRIMARIO -CA", categoria: 'CALIDAD' },
  { reclamo: "SIN LECTURA DE CODIGO DE BARRAS -CA", categoria: 'CALIDAD' },
  { reclamo: "HIGIENE DEL PRODUCTO -IM", categoria: 'IMAGEN' },
  { reclamo: "DEFORMACIONES DEL EMBALAJE -CA", categoria: 'CALIDAD' },
  { reclamo: "COLOR -IM", categoria: 'IMAGEN' },
  { reclamo: "MALAS CONDICIONES DE ETIQUETADO -CA", categoria: 'CALIDAD' },
  { reclamo: "MEZCLA DE LOTES Y FECHAS DE VENCIMIENTO -CA", categoria: 'CALIDAD' }
]);

const uniMedOptions = ref([]);

const handleFileChange = (event) => {
  foto.value = event.target.files[0];
};

const handleSubmit = async () => {
  try {
    console.log("Form Values:", form.value);
    
    // Check if the noReclamo already exists
    const checkReclamoResponse = await axios.post("https://pg-api.yes.com.sv/select", {
      query: `SELECT 1 FROM general.zcapta_reclamos WHERE no_reclamo = '${form.value.noReclamo}'`,
      db: {
        host: "192.168.103.55",
        database: "feldte"
      }
    });

    const reclamoExists = checkReclamoResponse.data.length > 0;

    const query = reclamoExists
      ? `
        UPDATE general.zcapta_reclamos
        SET
          fecha = '${new Date().toISOString()}',
          creado_por = '${form.value.creadoPor}',
          estatus = '${form.value.estatus}',
          pais = '${form.value.paisOrigen}',
          ruta = '${form.value.rutaCliente}',
          contacto = '${form.value.contacto}',
          telefono = '${form.value.telefono}',
          producto = '${form.value.producto}',
          cantidad = '${form.value.cantidad}',
          uni_med = '${form.value.uniMed}',
          tipo = '${form.value.tipoOrigen}',
          razon = '${form.value.razon}',
          familia = '${form.value.familiaProducto}',
          no_lote = '${form.value.noLote}',
          fecha_vencimiento = ${form.value.vencimiento ? `'${form.value.vencimiento}'` : 'NULL'},
          reclamo = '${form.value.descripcion}',
          area = '${form.value.areaResponsable}',
          comentario = '${form.value.comentario}'
        WHERE no_reclamo = '${form.value.noReclamo}'
      `
      : `
        INSERT INTO general.zcapta_reclamos (
          fecha, creado_por, no_reclamo, estatus, pais, ruta, contacto, telefono, producto, cantidad, uni_med, tipo, razon, familia, no_lote, fecha_vencimiento, reclamo, area, comentario
        ) VALUES (
          '${new Date().toISOString()}', 
          '${form.value.creadoPor}', 
          '${form.value.noReclamo}', 
          '${form.value.estatus}', 
          '${form.value.paisOrigen}', 
          '${form.value.rutaCliente}', 
          '${form.value.contacto}', 
          '${form.value.telefono}', 
          '${form.value.producto}', 
          '${form.value.cantidad}', 
          '${form.value.uniMed}', 
          '${form.value.tipoOrigen}', 
          '${form.value.razon}', 
          '${form.value.familiaProducto}', 
          '${form.value.noLote}', 
          ${form.value.vencimiento ? `'${form.value.vencimiento}'` : 'NULL'}, 
          '${form.value.descripcion}', 
          '${form.value.areaResponsable}', 
          '${form.value.comentario}'
        )`;

    const response = await axios.post("https://pg-api.yes.com.sv/insert", {
      query,
      db: {
        host: "192.168.103.55",
        database: "feldte"
      }
    });

    if (response.data.exito) {
      if (foto.value) {
        const formData = new FormData();
        formData.append('foto', foto.value);
        formData.append('no_reclamo', form.value.noReclamo);

        const uploadResponse = await axios.post("/api/subirfoto", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (uploadResponse.data.exito) {
          Swal.fire(
            'Éxito',
            'El formulario y la foto han sido guardados con éxito.',
            'success'
          ).then(() => {
            handleClear(); // Limpiar el formulario después de guardar
            incrementReclamoNumber(); // Incrementar el número de reclamo
          });
        } else {
          Swal.fire('Error', uploadResponse.data.mensaje, 'error');
        }
      } else {
        Swal.fire(
          'Éxito',
          'El formulario ha sido guardado con éxito.',
          'success'
        ).then(() => {
          handleClear(); // Limpiar el formulario después de guardar
          incrementReclamoNumber(); // Incrementar el número de reclamo
        });
      }
    }
    console.log("Formulario guardado:", response.data);
  } catch (error) {
    console.error("Error al guardar el formulario:", error);
  }
};

const handleClear = () => {
  const preservedValues = {
    noReclamo: form.value.noReclamo,
    creadoPor: form.value.creadoPor,
    fechaHora: form.value.fechaHora,
  };

  Object.keys(form.value).forEach((key) => {
    form.value[key] = "";
  });

  form.value.estatus = "ABIERTO"; // Restablecer el estado predeterminado

  Object.assign(form.value, preservedValues); // Restaurar los valores preservados
  foto.value = null;
};

const incrementReclamoNumber = () => {
  form.value.noReclamo = parseInt(form.value.noReclamo) + 1;
};

const handleLogout = async () => {
  await authStore.logout();
};

const fetchOptions = async (query) => {
  try {
    const response = await axios.post("https://pg-api.yes.com.sv/select", {
      query,
      db: {
        host: "192.168.103.55",
        database: "feldte"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
};

const fetchData = async () => {
  productos.value = await fetchOptions("SELECT producto, familia FROM general.zcapta_listado_prod;");
  estatusOptions.value = await fetchOptions("SELECT DISTINCT estatus FROM general.zcapta_varios;");
  paisOptions.value = await fetchOptions("SELECT DISTINCT pais FROM general.zcapta_varios;");
  rutaOptions.value = await fetchOptions("SELECT DISTINCT ruta FROM general.zcapta_varios;");
  tipoOptions.value = await fetchOptions("SELECT DISTINCT tipo FROM general.zcapta_varios;");
  familiaOptions.value = await fetchOptions("SELECT DISTINCT familia FROM general.zcapta_varios;");
  areaOptions.value = await fetchOptions("SELECT DISTINCT area FROM general.zcapta_varios;");
  uniMedOptions.value = await fetchOptions("SELECT DISTINCT uni_med FROM general.zcapta_varios;");
};

const filterProductosByFamilia = () => {
  filteredProductos.value = productos.value.filter(p => p.familia === form.value.familiaProducto);
};

const filteredReclamoOptions = computed(() => {
  return reclamoOptions.value.filter(reclamo => reclamo.categoria === form.value.razon);
});

const getLastReclamoNumber = async () => {
  try {
    const response = await axios.post("https://pg-api.yes.com.sv/select", {
      query: "SELECT MAX(no_reclamo) AS lastReclamoNumber FROM general.zcapta_reclamos;",
      db: {
        host: "192.168.103.55",
        database: "feldte"
      }
    });
    return response.data.length > 0 ? response.data[0].lastreclamonumber : 0;
  } catch (error) {
    console.error("Error fetching last reclamo number:", error);
    return 0;
  }
};

const enableEditing = () => {
  isEditable.value = true;
};

const fetchReclamo = async () => {
  enableEditing();
  try {
    const response = await axios.post("https://pg-api.yes.com.sv/select", {
      query: `SELECT * FROM general.zcapta_reclamos WHERE no_reclamo = '${form.value.noReclamo}' AND estatus = 'ABIERTO';`,
      db: {
        host: "192.168.103.55",
        database: "feldte"
      }
    });

    if (response.data.length > 0) {
      const data = response.data[0];
      const now = new Date();
      form.value = {
        ...form.value,
        fechaHora: `${now.toLocaleDateString("es-ES")} ${now.toLocaleTimeString("es-ES", { hour12: false })}`,
        creadoPor: data.creado_por,
        noReclamo: data.no_reclamo,
        estatus: data.estatus,
        paisOrigen: data.pais,
        rutaCliente: data.ruta,
        talonario: data.correlativo,
        contacto: data.contacto,
        telefono: data.telefono,
        producto: data.producto,
        cantidad: data.cantidad,
        uniMed: data.uni_med,
        tipoOrigen: data.tipo,
        razon: data.razon,
        familiaProducto: data.familia,
        noLote: data.no_lote,
        vencimiento: data.fecha_vencimiento,
        descripcion: data.reclamo,
        areaResponsable: data.area,
        comentario: data.comentario,
      };

      // Set the familiaProducto to match the product's family
      form.value.familiaProducto = data.familia;
      filterProductosByFamilia();

    } else {
      Swal.fire('Error', 'No se encontró un reclamo con ese id o el reclamo no está abierto.', 'error');
    }
  } catch (error) {
    console.error("Error fetching reclamo:", error);
  }
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    fetchReclamo();
  }
};

onMounted(async () => {
  authStore.loadSession();
  if (authStore.isAuthenticated() && authStore.hasGroup('CaptaReclamo')) {
    isAuthorized.value = true;
  } else {
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'No tienes los permisos necesarios para acceder a este sistema.',
      icon: 'error',
      confirmButtonText: 'Entendido'
    }).then(() => {
      router.push({ name: 'Login' });
    });
  }
  const now = new Date();
  form.value.fechaHora = `${now.toLocaleDateString("es-ES")} ${now.toLocaleTimeString("es-ES", { hour12: false })}`;
  authStore.loadSession(); // Cargar la sesión antes de usar authStore.user
  form.value.creadoPor = authStore.user ? authStore.user.Username : "Desconocido";
  
  // Obtener el último número de reclamo y establecer el siguiente
  const lastReclamoNumber = await getLastReclamoNumber();
  form.value.noReclamo = lastReclamoNumber + 1;

  fetchData().then(() => {
    filterProductosByFamilia();
  });
});
</script>

<style scoped>
.container {
  max-width: 800px;
  padding-left: 15px;
  padding-right: 15px;
}

.readonly-field {
  background-color: orange;
}
</style>