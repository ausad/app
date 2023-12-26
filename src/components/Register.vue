<template>
    <h3 class="ht">请注册</h3>
    <div class="login">
        <table class="tabs">
            <tr>
                <td>账号:</td>
                <td>
                    <el-input
                    class="in"
                    v-model="user.username" 
                    placeholder="请输入账号"
                    @blur="checkUsername()" />
                    <span>{{ usernameMSg }}</span>
                </td>
            </tr>
            <tr>
                <td>密码:</td>
                <td>
                    <el-input
                    class="in" 
                    v-model="user.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                    @blur="checkPassword()"/>
                    <span>{{ passwordMsg }}</span>
                </td>
            </tr>
            <tr>
                <td>重复密码:</td>
                <td>
                    <el-input
                    class="in" 
                    v-model="rePassword"
                    type="password"
                    placeholder="请再次输入密码"
                    show-password
                    @blur="checkRePassword()"/>
                    <span>{{ rePasswordMsg }}</span>
                </td>
            </tr>
        </table>
        <div class="btd">
            <el-button class="btn" type="success" @click="login()">登录</el-button>
            <el-button class="btn" type="primary" @click="register()">注册</el-button>
        </div>           
    </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import { ref,reactive } from 'vue'
import request from '../utils/request'
const usernameMSg = ref('')
const passwordMsg = ref('')
const rePassword = ref('')
const rePasswordMsg = ref('')

const router = useRouter()
const user = reactive({
    username:"",
    password:""
})
//校验用户名
async function checkUsername(){
    let usernameReg = /^[a-zA-Z0-9]{5,10}$/
    if(!usernameReg.test(user.username)){
        usernameMSg.value="格式有误"
        return false
    }
    //校验用户名是否占用
    let {data} = await request.post(`user/checkUserName?username=${user.username}`)
    if(data.code!=200){
        usernameMSg.value="已占用"
        return false
    }
    usernameMSg.value="可用"
    return true
}
//校验密码
function checkPassword(){
    let passwordReg = /^[0-9]{6}$/
    if(!passwordReg.test(user.password)){
        passwordMsg.value="格式有误"
        return false
    }
    passwordMsg.value="OK"
    return true    
}
//校验重复密码
function checkRePassword(){
    let passwordReg = /^[0-9]{6}$/
    if(!passwordReg.test(rePassword.value)){
        rePasswordMsg.value="格式有误"
        return false
    }
    if(rePassword.value!=user.password){
        rePasswordMsg.value="重复密码错误"
        return false
    }
    rePasswordMsg.value="OK"
    return true
}
//登录方法
function login(){
    router.push("login")
}
//注册方法
async function register(){
    //校验所有输入框是否合法
    let flag1 = await checkUsername()
    let flag2 = await checkPassword()
    let flag3 = await checkRePassword()
    if(flag1&&flag2&&flag3){
        let {data} = await request.post("user/register",user)
        if(data.code==200){
            router.push("login")
        }else{
            alert("抱歉，用户名被抢注了")
        }
    }else{
        alert("校验格式有误")
    }
}
</script>

<style scoped>
.in{
    width: 200px;
    margin: 5px;
}
.ht{
    font-size: 36px;
    margin-top: 150px;
    font-family: cursive;
    text-align: center;
}

.tabs{
    margin: auto;
}
.btd{
    text-align: center;
}
.btn{
    margin: 20px;
}
</style>
