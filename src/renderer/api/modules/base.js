import request from '../fetch'

const baseApi = {
    // 登录
    login: data => {
        return request({
            url: '/api/login',
            method: 'post',
            data
        })
    },
    // 渠道列表接口
    getChannleList: params => {
        return request({
            url: '/channleList',
            method: 'get',
            params: params
        })
    },
    // 游戏列表接口
    getGameList: params => {
        return request({
            url: '/gameList',
            method: 'get',
            params: params
        })
    },
    // 获取用户信息
    getUserInfo: data => {
        return request({
            url: '/api/getUserInfo',
            method: 'post',
            data
        })
    },
    // 修改密码
    changePwd: data => {
        return request({
            url: '/api/changePwd',
            method: 'post',
            data
        })
    }
}

export default baseApi
