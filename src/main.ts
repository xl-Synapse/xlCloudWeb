import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import './assets/main.css' // 组件居中在这里面、

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.config.errorHandler = (err) => {
    /* 处理错误 */
    console.log("xl error!")
    console.log(err)
  }

app.mount('#app')

