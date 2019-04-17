import Vue from 'vue'
import App from './App.vue'

import api from './plugins/api'

Vue.config.productionTip = false

Vue.use(api, {
    url: 'http://localhost:3000'
})

new Vue({
    render: h => h(App)
}).$mount('#app')
