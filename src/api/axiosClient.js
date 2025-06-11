import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:8001/api/',
})

const token = localStorage.getItem('token')
if (token) {
    client.defaults.headers.common['Authorization'] = `Token ${token}`
}

export default client