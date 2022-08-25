import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './routers'
import 'element-plus/dist/index.css'
import './style/index.css/'

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia).use(ElementPlus).use(router)

pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

app.mount('#app')
