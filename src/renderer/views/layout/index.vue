<template>
    <el-container class="layout">
        <!-- 侧边菜单 -->
        <el-aside class="aside" width="240px" :class="{'collapse':isCollapse}">
            <div class="title" :class="{'collapse':isCollapse}">
                <transition name="sidebarTitle">
                    <span class="title-name" v-if="!isCollapse">SDK</span>
                </transition>
            </div>
            <div class="menu">
                <el-menu
                    unique-opened
                    router
                    class="aside-menu"
                    text-color="#818EA5"
                    active-text-color="#2A6AFF"
                    background-color="#fff"
                    :default-active="$route.path"
                    :collapse="isCollapse"
                    >
                    <el-menu-item index="/home">
                        <!-- <svg-icon class="menu-icon" :svg-name="$route.name === 'welcome' ? 'menuHomeOn' : 'menuHomeOff'" /> -->
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <template v-for="item in menus">
                        <el-submenu v-if="item.parentMenuId === 0" :key="item.menuId" :index="item.menuName">
                            <template slot="title">
                                <!-- <svg-icon class="menu-icon" :svg-name="$route.path.indexOf(item.anchor) !== -1 ? `${item.menuIcon}-on` : `${item.menuIcon}-off`" /> -->
                                <span slot="title">{{ item.menuName }}</span>
                            </template>
                            <template v-for="itemChild in menus">
                                <el-menu-item
                                    v-if="itemChild.parentMenuId === item.menuId"
                                    :key="itemChild.menuId"
                                    :index="itemChild.anchor"
                                    >
                                    {{ itemChild.menuName }}
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu>
            </div>
        </el-aside>
        <!-- 主体内容 -->
        <el-container class="container">
            <!-- 头部内容 -->
            <el-header class="header" height="64px">
                <div class="header-box">
                    <a class="header_btn-collapse" @click="isCollapse = !isCollapse">
                        <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" />
                    </a>
                    <div class="header-handle">
                        <span class="header-userinfo">
                            <span v-if="merInfo.realName" class="header-username">{{ merInfo.realName }}</span>
                            <span v-if="userInfo.platAccount">（{{ userInfo.platAccount }}）</span>
                            <a class="sign-out" @click="signOut">
                                <!-- <svg-icon svg-name="login-out" /> -->
                                退出
                            </a>
                        </span>
                    </div>
                </div>
            </el-header>
            <!-- 正文内容 -->
            <el-main class="main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// import SvgIcon from '@/components/SvgIcon'
// import { mapState } from 'vuex'
import {Container, Main, Aside, Header, Menu, Submenu, MenuItem} from 'element-ui'

export default {
    name: 'Layout',
    components: {
        // SvgIcon,
        'elContainer': Container,
        'elMain': Main,
        'elAside': Aside,
        'elHeader': Header,
        'elMenu': Menu,
        'elSubmenu': Submenu,
        'elMenuItem': MenuItem
    },
    created () {
        this.getMerInfo() // 获取用户信息，渠道信息
        this.initMenu() // 获取菜单
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            vm.breadPreTitle = to.meta.preTitle || ''
            vm.breadTitle = to.meta.title || ''
        })
    },
    watch: {
        $route (to, from) {
            this.breadPreTitle = to.meta.preTitle || ''
            this.breadTitle = to.meta.title || ''
        }
    },
    computed: {
        // ...mapState([
        //     'brandInfo'
        // ])
    },
    data () {
        return {
            merInfo: {},
            userInfo: {},
            isCollapse: false,
            visualizationSmsSwitch: null,
            cautionVisible: false,
            cautionData: {},
            menus: [],
            breadPreTitle: '',
            breadTitle: '',
            // 弹窗
            showDialog: false,
            showMobile: false,
            mobileBindingData: {},
            showNotice: false,
            noticeList: null
        }
    },
    methods: {
        // 获取用户信息，渠道信息
        getMerInfo () {
            // this.$store.dispatch('getMerInfo').then(res => {
            // })
        },
        // 获取菜单
        initMenu () {
            this.$apis.getChannleList().then(res => {
                console.log('res: ', res)
            })
        },
        // 登出
        signOut () {
            this.$confirm('确定要退出吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                // this.$apis.logout().then((res) => {
                // })
            }).catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
