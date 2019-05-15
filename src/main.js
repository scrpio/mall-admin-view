import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import '@/styles/index.scss' // global css
import '@/assets/css/font-awesome.min.css'

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang'

import '@/icons' // icon
import '@/permission' // permission control
import '@/errorLog'

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App)
})
