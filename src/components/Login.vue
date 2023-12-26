<template>
    <h3 class="ht">请登录</h3>
    <div class="login">
        <table class="tabs">
            <tr>
                <td>账号:</td>
                <td>
                    <el-input 
                    class="in" 
                    v-model="user.username" 
                    placeholder="请输入账号" 
                    @blur="checkUsername()"/>
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
        </table>
        <div class="btd">
            <el-button class="btn" type="success" @click="login()">登录</el-button>
            <el-button class="btn" type="primary" @click="register()">注册</el-button>
        </div>           
    </div>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue'
import request from '../utils/request';
import {defineUser} from  '../store/userStore'
let loginuser = defineUser()
const usernameMSg = ref('')
const passwordMsg = ref('')
import {useRouter} from 'vue-router'
const user = reactive({
    username:"",
    password:""
})
const router = useRouter()
function checkUsername(){
    let usernameReg = /^[a-zA-Z0-9]{5,10}$/
    if(!usernameReg.test(user.username)){
        usernameMSg.value="格式有误"
        return false
    }
    usernameMSg.value="OK"
    return true
}
function checkPassword(){
    let passwordReg = /^[0-9]{6}$/
    if(!passwordReg.test(user.password)){
        passwordMsg.value="格式有误"
        return false
    }
    passwordMsg.value="OK"
    return true    
}
async function login(){
        //校验所有输入框是否合法
    let flag1 = await checkUsername()
    let flag2 = await checkPassword()
    if(flag1&&flag2){
        let {data} = await request.post("user/login",user)
        console.log(data)
        if(data.code==200){
            loginuser.uid = data.data.user.userId
            loginuser.username = data.data.user.username
            router.push("/")
        }else if(data.code==501){
            alert("用户名有误")
        }else if(data.code==503){
            alert("密码有误")
        }else{
            alert("未知错误")
        }
    }else{
        alert("校验格式有误")
    }
}

function register(){
    router.push("register")
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
