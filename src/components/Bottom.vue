<template>
  <el-tabs :tab-position="tabPosition" style="height: 500px;margin:auto ;" class="demo-tabs">
    <el-tab-pane label="系统首页"><index></index></el-tab-pane>
    <el-tab-pane label="登录"><login></login></el-tab-pane>
    <el-tab-pane label="注册"><register></register></el-tab-pane>
    <el-tab-pane label="部门管理"><department></department></el-tab-pane>
    <el-tab-pane label="岗位信息">岗位信息</el-tab-pane>
    <el-tab-pane label="员工信息">员工信息</el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import index from './index.vue'
import login from './Login.vue'
import register from './Register.vue'
import department from './Department.vue'
const tabPosition = ref('left')
</script>
<style>
/* 修改字体大小 */
.el-tabs__item {
  font-size: 18px; /* 设置字体大小为16像素 */
}

/* 修改间距 */
.el-tabs__item {
  margin-right: 20px;
  margin-bottom: 15px; /* 设置下边距为10像素 */
}

</style>
