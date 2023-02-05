import { createRouter, createWebHashHistory } from "vue-router"
import Main from "../views/Main.vue"

const routes = [{
        path: '/',
        component: Main,
        children: [{
                path: '/',
                name: 'home',
                meta: {
                    title: '系统首页'
                },
                component: () =>
                    import ('../views/Home.vue')
            },
            {
                path: '/category',
                name: 'category',
                meta: {
                    title: '分类表'
                },
                component: () =>
                    import ('../views/Category.vue')
            },
            {
                path: '/provinces',
                name: 'provinces',
                meta: {
                    title: '省份表'
                },
                component: () =>
                    import ('../views/Provinces.vue')
            },
            {
                path: '/storage',
                name: 'storage',
                meta: {
                    title: '题库表'
                },
                component: () =>
                    import ('../views/Storage.vue')
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '用户表'
                },
                component: () =>
                    import ('../views/User.vue')
            },
            {
                path: '/employee',
                name: 'employee',
                meta: {
                    title: '员工表'
                },
                component: () =>
                    import ('../views/Employee.vue')

            }


        ]

    },
    {
        path: "/login",
        name: "login",
        meta: {
            title: '登录'
        },
        component: () =>
            import ("../views/Login.vue")
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('userInfo');
    if (!role && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
});

export default router