// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
import router from '@/router'
import store from '@/store'
import Vuetify from 'vuetify'
import theme from './plugins/theme'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import NProgress from 'nprogress'
import Vuelidate from 'vuelidate'

Vue.prototype.$http = axios
// Sets the default url used by all of this axios instance's requests
axios.defaults.baseURL = '/api/v1/'
axios.defaults.headers.get['Accept'] = 'application/json'

const token = localStorage.getItem('token')
if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}
axios.interceptors.request.use(
    function (request) {
        // Do something before request is sent
        NProgress.start()
        return request
    },
    function (error) {
        // Do something with request error
        console.log(error)
        NProgress.done()
        return Promise.reject(error)
    }
)

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        NProgress.done()
        return response
    },
    function (error) {
        // Do something with response error
        console.log(error)
        if (error.response.status === 401) {
            console.log('Failed to login')
        }
        NProgress.done()
        return Promise.reject(error)
    }
)

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

import YmapPlugin from 'vue-yandex-maps'

const settings = {
    apiKey: 'bcd1a663-292a-45e7-93f0-a225fd39e362',
    lang: 'ru_RU',
    coordorder: 'latlong',
    version: '2.1'
}
Vue.use(YmapPlugin, settings)

// Sync store with router
sync(store, router)

Vue.use(Vuetify, {
    iconfont: 'mdi',
    theme
})

Vue.use(Vuelidate)

/* eslint-disable no-new */
new Vue({
    router,
    store,
    vuetify : new Vuetify(),
    render: h => h(App)
}).$mount('#app')
