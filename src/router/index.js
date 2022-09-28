import Vue from 'vue'
import VueRouter from 'vue-router'
import Desge from '@/views/index/DesignHome.vue'
import Homes from '@/views/index/Home.vue'
import Login from '@/views/index/login.vue'
import Indexs from '@/views/index/index.vue'

/*统计信息*/
import deviceList from '@/views/page/DeviceList.vue'

/*统计信息*/
import taskmanagement from '@/views/page/TaskManagement.vue'


/*缺陷管理*/
import defectList from '@/views/page/DefectList.vue'


/*申请信息*/
import applyList from '@/views/page/ApplyList.vue'


/*项目信息*/
import projectList from '@/views/page/ProjectList.vue'


/*需求信息*/
import demandList from '@/views/page/DemandList.vue'

/*组织角色管理*/
import orgRoleList from '@/views/page/OrgRoleList.vue'


import Parser from '@/components/parser/example/Index.vue'


import Tinymce from '@/components/tinymce/example/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Homes,
    meta: {
      title: '首页',
      requiresAuth:true
    }
  },
  {
    path: '/desge',
    name: 'desge',
    component: Desge,
    meta: {
      title: '设计页面',
      requiresAuth:false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录页面',
      requiresAuth:true
    }
  },
  {
    path: '/parser',
    name: 'parser',
    component: Parser,
    meta: {
      requiresAuth:false
    },

  },
  {
    path: '/tinymce',
    name: 'tinymce',
    component: Tinymce,
    meta: {
      requiresAuth:false
    },
  },

  {
    path: '/indexs',
    name: 'indexs',
    component: Indexs,
    meta: {
      title: '任务统计页',
      requiresAuth:false
    },
    children: [
      //统计功能；
      {
        path: '/deviceList',
        component: deviceList,
        meta: {
          requiresAuth:false
        },
      },
      //统计功能；
      {
        path: '/taskmanagement',
        component: taskmanagement,
        meta: {
          requiresAuth:false
        },
      },
      //缺陷管理；
      {
        path: '/defectList',
        component: defectList,
        meta: {
          requiresAuth:false
        },
      },
      //申请管理；
      {
        path: '/applyList',
        component: applyList,
        meta: {
          requiresAuth:false
        },
      },
      //项目管理；
      {
        path: '/projectList',
        component: projectList,
        meta: {
          requiresAuth:false
        },
      },
      //需求信息；
      {
        path: '/demandList',
        component: demandList,
        meta: {
          requiresAuth:false
        },
      },
      //组织角色管理；
      {
        path: '/orgRoleList',
        component: orgRoleList,
        meta: {
          requiresAuth:false
        },
      },
    ]
  },


]




const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior: () => ({ y: 0 })

})

export default router
