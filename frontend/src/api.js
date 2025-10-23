import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // ← DEBE SER 3000

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios para Empleados
export const empleadoService = {
  getAll: () => api.get('/empleados'),
  getById: (id) => api.get(`/empleados/${id}`),
  create: (data) => api.post('/empleados', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  delete: (id) => api.delete(`/empleados/${id}`),
  asignarRoles: (id, roles) => api.post(`/empleados/${id}/roles`, { roles }),
};

// Servicios para Sectores
export const sectorService = {
  getAll: () => api.get('/sectores'),
  getEmpleadosBySector: (id) => api.get(`/sectores/${id}/empleados`),
};

// Servicios para Roles
export const rolService = {
  getAll: () => api.get('/roles'),
};

export default api;