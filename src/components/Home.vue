<template>
  <el-tabs :tab-position="tabPosition" style="height: 100%;margin:auto ;" class="demo-tabs">
    <el-tab-pane label="系统首页"><index></index></el-tab-pane>
    <el-tab-pane label="部门管理"><department></department></el-tab-pane>
    <el-tab-pane label="岗位信息"><job></job></el-tab-pane>
    <el-tab-pane label="员工信息"><employee></employee></el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import index from './index.vue'
import department from './Department.vue'
import job from './Job.vue'
import employee from './Employee.vue'
const tabPosition = ref('left')
</script>
<style>
/* 修改字体大小 */
.el-tabs__item {
  font-size: 18px; /* 设置字体大小为16像素 */
}

/* 修改间距 */
.el-tabs__item {
  margin:25px 20px;
}

</style>
