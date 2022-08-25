import axios from 'axios'
import router from '../routers'

export const request = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.response.use(
  res => res,
  err => {
    console.log(err.response.data)
    // if (err.response.status === 401) {
    //   // const router = useRouter()
    //   return router.push({ name: 'Login' })
    // }
    return Promise.reject(err)
  }
)
