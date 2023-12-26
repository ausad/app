<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
  <router-link to="/" style="text-decoration: none;">
    <el-menu-item index="1">
        企业人事管理系统
    </el-menu-item>
  </router-link>
    <el-sub-menu index="2">
      <template #title>系统功能</template>
      <router-link to="/department" style="text-decoration: none;">
        <el-menu-item index="2-1">部门管理</el-menu-item>
      </router-link>
      <router-link to="/job" style="text-decoration: none;">
        <el-menu-item index="2-2">岗位信息</el-menu-item>
      </router-link>
      <router-link to="/employee" style="text-decoration: none;">
        <el-menu-item index="2-3">员工信息</el-menu-item>
      </router-link>
      <el-sub-menu index="2-4">
        <template #title>关于我们</template>
        <el-menu-item index="2-4-1">哈喽</el-menu-item>
        <el-menu-item index="2-4-2">这里是</el-menu-item>
        <el-menu-item index="2-4-3">自由</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-text class="mx-1" size="large" v-if="user.username!=''">欢迎
      <el-text class="mx-1" type="success">{{user.username}}</el-text>
      登录</el-text>
    <el-sub-menu index="3" v-else>
      <template #title>登录/注册</template>
        <router-link to="/login" style="text-decoration: none;">
          <el-menu-item index="3-1">登录</el-menu-item>
        </router-link>
        <router-link to="/register" style="text-decoration: none;">
          <el-menu-item index="3-2">注册</el-menu-item>
        </router-link>
    </el-sub-menu>
    <el-menu-item index="4">
      <el-button plain @click="logout">退出登录</el-button>
    </el-menu-item>
    
  </el-menu>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import {defineUser} from  '../store/userStore'
let router = useRouter()
let user = defineUser()
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
function logout(){
  user.$reset()
  router.push("login")
}
</script>
<style scoped>
h1{
  text-align: center;
}
.el-menu-demo{
  display: flex;
  justify-content: center;
  align-items: center;
}
.in{
    margin: 5px;
    width: 200px;
}
.ht{
    text-align: center;
}
.login{
    width: 210px;
    height: 400px;
    margin: auto;
}
.bt{
    text-align: center;
}
.btn{
    text-align: center;
    width: 200px;
}
</style>

