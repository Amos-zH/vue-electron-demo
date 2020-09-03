<template>
    <el-form :model="packForm" :rules="rules" ref="packForm" label-width="140px" class="demo-packForm">
        <el-form-item label="母包路径：" prop="tv_base_apk_path">
            <el-input v-model="packForm.tv_base_apk_path" readonly>
                <el-button slot="append" @click="onChooseBaseApk">选择母包路径</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="输出目录：" prop="tv_output_dir">
            <el-input v-model="packForm.tv_output_dir" readonly>
                <el-button slot="append">选择输出目录</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="额外资源目录：" prop="tv_extra_dir">
            <el-input v-model="packForm.tv_extra_dir" readonly>
                <el-button slot="append">选择额外资源目录</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="签名文件路径：" prop="tv_sign_path">
            <el-input v-model="packForm.tv_sign_path" readonly>
                <el-button slot="append">选择签名文件路径</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="签名密码：" prop="tv_sign_pass">
            <el-input v-model="packForm.tv_sign_pass" placeholder="请输入签名密码" />
        </el-form-item>
        <el-form-item label="签名 alias：" prop="tv_sign_alias">
            <el-input v-model="packForm.tv_sign_alias" placeholder="请输入签名 alias" />
        </el-form-item>
        <el-form-item label="签名 alias pass：" prop="tv_sign_alias_pass">
            <el-input v-model="packForm.tv_sign_alias_pass" placeholder="请输入签名 alias pass" />
        </el-form-item>
        <el-form-item label="输出包的文件名：" prop="tv_output_name">
            <el-input v-model="packForm.tv_output_name" placeholder="请输入输出包的文件名" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handlePack">开始打包</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {Form, FormItem, Input, Button} from 'element-ui'

export default {
    name: 'Home',
    components: {
        'elInput': Input,
        'elForm': Form,
        'elFormItem': FormItem,
        'elButton': Button
    },
    data() {
        return {
            packForm: {},
            rules: {
                tv_base_apk_path: [
                    { required: true, message: '母包路径必填', trigger: 'blur' }
                ],
                tv_output_dir: [
                    { required: true, message: '输出目录必填', trigger: 'blur' }
                ],
                tv_extra_dir: [
                    { required: true, message: '额外资源目录必填', trigger: 'blur' }
                ],
                tv_sign_path: [
                    { required: true, message: '签名文件路径必填', trigger: 'blur' }
                ],
                tv_sign_pass: [
                    { required: true, message: '签名密码必填', trigger: 'blur' }
                ],
                tv_sign_alias: [
                    { required: true, message: '签名 alias 必填', trigger: 'blur' }
                ],
                tv_sign_alias_pass: [
                    { required: true, message: '签名 alias pass 必填', trigger: 'blur' }
                ],
                tv_output_name: [
                    { required: true, message: '输出包的文件名必填', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        onChooseBaseApk () {
            const paths = this.$deskDialog.showOpenDialogSync({filters: [{name: 'Apk', extensions: ['apk']}], properties: ['openFile']})
            // const textView = document.getElementById('tv_base_apk_path')
            if (paths && paths.length > 0) {
                // textView.innerText = paths[0]
                this.packForm.tv_base_apk_path = paths[0]
            }
        },
        handlePack () {
            this.$refs.packForm.validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm () {
            this.$refs.packForm.resetFields();
        }
    }
}
</script>

<style lang="scss" scoped>

</style>