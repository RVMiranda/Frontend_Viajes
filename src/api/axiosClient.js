import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:8001/api/',
})

// Interceptor para agregar Authorization automáticamente en cada request
client.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Token ${token}`
    } else {
        delete config.headers.Authorization
    }
    return config
})

export default client
