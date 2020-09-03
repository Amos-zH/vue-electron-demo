import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api' // 引入接口
import electron, { ipcRenderer, remote } from 'electron'
import fs from 'fs'
import child_process from 'child_process'

Vue.config.productionTip = false

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$ELEMENT = { size: 'medium', zIndex: 3000 };
// vue原型挂载 - 请求接口函数
Vue.prototype.$apis = api
Vue.prototype.$electron = electron
Vue.prototype.$ipcRenderer = ipcRenderer
Vue.prototype.$remote = remote
Vue.prototype.$fileSys = fs
Vue.prototype.$process = child_process
Vue.prototype.$deskDialog = remote.dialog

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
