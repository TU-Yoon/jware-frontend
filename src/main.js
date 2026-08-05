import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// vuetify 관련 라이브러리
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // 아이콘 폰트

// vuetify 인스턴스 생성
const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify) // vue 앱에 vuetify 플러그인 등록

app.mount('#app')