export const constantRouterMap = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/index/Home'),
        meta: {
            title: '首页',
            requiresAuth: true
        }
    },
    {
        path: '/desge',
        name: 'desge',
        component: () => import('../views/index/DesignHome'),
        meta: {
            title: '设计页面',
            requiresAuth: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/index/login'),
        meta: {
            title: '登录页面',
            requiresAuth: true
        }
    },
    {
        path: '/parser',
        name: 'parser',
        component: () => import('../components/parser/example/Index'),
        meta: {
            requiresAuth: false
        },

    },
    {
        path: '/tinymce',
        name: 'tinymce',
        component: () => import('../components/tinymce/example/Index'),
        meta: {
            requiresAuth: false
        },
    },

    {
        path: '/indexs',
        name: 'indexs',
        component: () => import('../views/index/index'),
        meta: {
            title: '任务统计页',
            requiresAuth: false
        },
        children: [
            //统计功能；
            {
                path: '/deviceList',
                component: () => import('../views/page/DeviceList'),
                meta: {
                    requiresAuth: false
                },
            },
            //统计功能；
            {
                path: '/taskmanagement',
                component: () => import('../views/page/TaskManagement'),
                meta: {
                    requiresAuth: false
                },
            },
            //缺陷管理；
            {
                path: '/defectList',
                component: () => import('../views/page/DefectList'),
                meta: {
                    requiresAuth: false
                },
            },
            //申请管理；
            {
                path: '/applyList',
                component: () => import('../views/page/ApplyList'),
                meta: {
                    requiresAuth: false
                },
            },
            //项目管理；
            {
                path: '/projectList',

                component: () => import('../views/page/ProjectList'),
                meta: {
                    requiresAuth: false
                },
            },
            //需求信息；
            {
                path: '/demandList',
                component: () => import('../views/page/DemandList'),
                meta: {
                    requiresAuth: false
                },
            },
            //组织角色管理；
            {
                path: '/orgRoleList',
                component: () => import('../views/page/OrgRoleList'),
                meta: {
                    requiresAuth: false
                },
            },
        ]
    },
]
