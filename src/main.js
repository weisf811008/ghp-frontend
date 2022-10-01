import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './routers'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/dist/index.css'
import './style/index.scss'

const app = createApp(App)
const pinia = createPinia()

Object.entries(ElementPlusIconsVue).forEach(([key, component]) =>
  app.component(key, component)
)

// pinia.use((context) => {
//   const storeId = context.store.$id
//   const serializer = {
//     serialize: JSON.stringify,
//     deserialize: JSON.parse,
//   }

//   const fromStorage = serializer.deserialize(
//     window.localStorage.getItem(storeId)
//   )

//   if (fromStorage) {
//     context.store.$patch(fromStorage)
//   }

//   context.store.$subscribe((mutation, state) => {
//     window.localStorage.setItem(storeId, serializer.serialize(state))
//   })
// })

app.use(pinia).use(ElementPlus).use(router)

app.mount('#app')
