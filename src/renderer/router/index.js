import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)
Vue.prototype.__cancels__ = []

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
    // 当路由切换页面的时候，遍历全局数组，将上一个页面的所有请求cancel掉
    Vue.prototype.__cancels__.forEach((cancel) => {
        cancel && cancel()
    })
    Vue.prototype.__cancels__ = []
    next()
    // 路由跳转时，判断是否有用户信息，没有就重新登录
    // const user = JSON.parse(window.sessionStorage.getItem('vuex')) ? JSON.parse(window.sessionStorage.getItem('vuex')).userInfo : {}
    // if (user.platAccount) {
    //     // 有用户信息
    //     if (to.path === '/login') {
    //         // 跳转登录页的话，重定向到首页
    //         next({ path: '/' })
    //     } else {
    //         // 其他页直接跳转
    //         next()
    //     }
    // } else {
    //     // 没有用户信息
    //     if (to.path === '/login') {
    //         // 跳转登录页，直接跳转
    //         next()
    //     } else {
    //         if (to.path === '/welcome' && from.path === '/login') {
    //             // 从登入页跳转到首页，直接跳转
    //             next()
    //         } else {
    //             // 其他跳转都重定向到登录页
    //             next({ path: '/login' })
    //         }
    //     }
    // }
})

export default router
