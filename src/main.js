import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(Antd)
app.use(createPinia())
app.use(router)
app.mount('#app')
