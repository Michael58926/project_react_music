import axios from 'axios'

axios.interceptors.request.use((config) => {
  let token = sessionStorage.getItem('token')
  config.url = process.env.REACT_APP_BASE_URL + config.url
  if (!config.url.includes('login') && !config.url.includes('register')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axios
