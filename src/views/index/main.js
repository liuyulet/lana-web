import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import axios from 'axios'
import Tinymce from '@/components/tinymce/index.vue'

import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.component('tinymce', Tinymce)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    console.log(to, from)
    if (to.meta.requiresAuth) {
        next();
    } else {
        let token = localStorage.getItem('X-Access-Token');
        if (to.meta.requiresAuth && token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')


