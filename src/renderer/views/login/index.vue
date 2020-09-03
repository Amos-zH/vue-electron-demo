<template>
    <div class="login-box">
        <img class="login-img" src="@/assets/logo.png" alt="">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="auto" class="login-form">
            <el-form-item label="" prop="account">
                <el-input
                    v-model="loginForm.account"
                    placeholder="账号"
                    autofocus
                    clearable
                    prefix-icon="el-icon-user-solid"
                    @keyup.enter.native="login"
                />
            </el-form-item>
            <el-form-item label="" prop="pwd">
                <el-input
                    v-model="loginForm.pwd"
                    placeholder="6位密码"
                    type="password"
                    show-password
                    clearable
                    prefix-icon="el-icon-lock"
                    @keyup.enter.native="login"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    class="login-btn"
                    type="primary"
                    @click="login"
                    >
                    登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Form, FormItem, Input, Button } from 'element-ui';

export default {
    components: {
        'elInput': Input,
        'elForm': Form,
        'elFormItem': FormItem,
        'elButton': Button
    },
    data() {
        return {
            loginForm: {},
            rules: {}
        };
    },
    created() {
    },
    methods: {
        login () {
            this.$router.push('./home')
        }
    }
};
</script>

<style lang='scss' scoped>
.login-box {
    width: 300px;
    height: 500px;
    margin: auto;
    background: linear-gradient(to bottom,#ad40ff,#259265);
    -webkit-background-clip: padding-box;
    text-align: center;
    position: relative;
}
.login-img {
    width: 200px;
    height: 50px;
    margin-top: 30px;
}
.login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%, -50%);
    .login-btn {
        width: 100%;
        letter-spacing: 10px;
    }
}
</style>