import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './routers'
import 'element-plus/dist/index.css'
import './style/index.css'

const app = createApp(App)
const pinia = createPinia()

Object.entries(ElementPlusIconsVue).forEach(([key, component]) =>
  app.component(key, component)
)

app.use(pinia).use(ElementPlus).use(router)

// pinia.use(({ store }) => {
//   store.$router = markRaw(router)
// })

app.mount('#app')
