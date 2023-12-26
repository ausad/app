<template>
  <el-text class="mx-1" type="primary"><h1>欢迎进入人事管理系统</h1></el-text>
  <el-carousel :interval="4000" type="card" height="500px">
    <el-carousel-item v-for="item in 4" :key="item">
      <img src="../images/1.png" v-if="item==1"/>
      <img src="../images/2.png" v-if="item==2"/>
      <img src="../images/3.png" v-if="item==3"/>
      <img src="../images/4.png" v-if="item==4"/>
      {{ item }}
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
h1{
  text-align: center;
  font-size:40px;
  font-family: cursive;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
