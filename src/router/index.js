import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'
import {constantRouterMap} from '../config/router.config'

Vue.use(VueRouter)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: constantRouterMap,
    scrollBehavior: () => ({y: 0})
})

export default router
