const routes = [
    {
        path: '/',
        redirect: './login'
    }, {
        path: '/landing-page',
        name: 'landing-page',
        component: require('@/components/LandingPage').default
    }, {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/index')
    }, {
        path: 'layout',
        name: 'layout',
        component: () => import(/* webpackChunkName: "layout" */ '@/views/layout/index'),
        children: [{
            path: '/home',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ '@/views/home/index'),
            meta: {
                title: '首页'
            }
        }]
    }, {
        path: '*',
        redirect: '/'
    }
]

export default routes