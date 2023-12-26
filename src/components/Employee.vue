<template>
  <el-text class="mx-1" type="primary"><h1>员工管理</h1></el-text>
    <div class="tab">
      <el-button @click="deleteSelectedRows">删除选中行</el-button>
        <el-button class="bt" plain  @click="add()">新增员工</el-button>
    <el-table :data="tableData" :key="itemkey" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="employeeId" label="ID" width="80" />
      <el-table-column prop="employeeName" label="姓名" width="80" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column prop="address" label="家庭住址" width="200" />
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="email" label="邮箱" width="150" />
      <el-table-column prop="departmentId" label="所属部门" width="80"/>
      <el-table-column prop="jobId" label="所属岗位" width="80"/>
      <el-table-column  label="操作">
        <template #default="{ row }">
          <el-button type="primary" plain @click="change(row)">修改</el-button>
          <el-button type="danger" plain @click="open(row)">解雇员工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-config-provider :locale="zhCn">
      <el-pagination 
      class="page"
      v-if="pageshow"
        v-model:current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        v-model:page-size="pageSize"
        v-model:total="total"
        layout="sizes,prev, pager, next,jumper,total" 
        />
    </el-config-provider>
    </div>

    <el-dialog v-model="dialogFormVisible" width="500px" title="新增部门">
    <el-form :model="employees">
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="employees.employeeName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-radio-group v-model="employees.gender" class="ml-4">
          <el-radio label="男" size="large">男</el-radio>
          <el-radio label="女" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="家庭住址" :label-width="formLabelWidth">
        <el-cascader
        placeholder="请选择地址"
        size="large"
        :options="pcaTextArr"
        v-model="employees.address"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth">
        <el-input v-model="employees.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="employees.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门id" :label-width="formLabelWidth">
        <el-input v-model="employees.departmentId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="岗位id" :label-width="formLabelWidth">
        <el-input v-model="employees.jobId" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addEmployee();dialogFormVisible = false">
          确认
        </el-button>
      </span>
    </template>
    </el-dialog>

    <el-dialog v-model="dialogForm" width="500px" title="修改部门">
    <el-form :model="employees">
      <el-form-item label="员工id" :label-width="formLabelWidth">
        <el-input v-model="employees.employeeId" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="employees.employeeName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-input v-model="employees.gender" autocomplete="off" />
      </el-form-item>
      <el-form-item label="家庭住址" :label-width="formLabelWidth">
        <el-input v-model="employees.address" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth">
        <el-input v-model="employees.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="employees.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门id" :label-width="formLabelWidth">
        <el-input v-model="employees.departmentId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="岗位id" :label-width="formLabelWidth">
        <el-input v-model="employees.jobId" autocomplete="off" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogForm = false">取消</el-button>
        <el-button type="primary" @click="updateJob(employees);dialogForm = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  </template>
  
  <script lang="ts" setup>
import { ref,reactive,watch,computed,onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import request from '../utils/request'
import {pcaTextArr} from "element-china-area-data";
let itemkey =ref()
let dialogFormVisible = ref(false)
let dialogForm = ref(false)
const formLabelWidth = '130px'
let selectedRows= ref([])
let currentPage = ref(1); //当前页面
let pageSize = ref(5) // 每页显示的数据条数
let total = 100; // 总数据条数
//刷新页面（很重要）
let lastPage = ref(1)
let pageshow = ref(false)
//数组接收后端数据
const dataList = ref([]);
//响应式实现双向绑定实时更新表格内容
let tableData = computed(getList);
// 计算当前页显示的数据
function getList() {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return dataList.value.slice(start, end);
    }
watch(dataList, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    total = newVal.length; // 更新 total 变量
  }
});
  let employees = reactive({
    employeeId:'',
    employeeName: '',
    gender: '',
    address: '',
    phone:'',
    email: '',
    departmentId: '',
    jobId: ''
    })
  onMounted(()=>{
        show()
    })
  function handleSelectionChange(selection:any) {
  selectedRows.value = selection;
  }
  function deleteSelectedRows() {
      for (let i = 0; i < selectedRows.value.length; i++) {
        deleteItem(selectedRows.value[i])
      }
  }
  async function show(){
      let {data} = await request.get(`employee/find`)
      itemkey.value=Math.random()
      pageshow.value=true 
      dataList.value=data.data
      console.log(dataList.value);
      total=data.data.length
      lastPage.value= Math.ceil((total - 1) / pageSize.value);
      currentPage.value = lastPage.value < currentPage.value ? lastPage.value : currentPage.value;
  }
  function add(){
    employees.employeeId=""
    employees.employeeName=""
    employees.gender=""
    employees.address=""
    employees.phone=""
    employees.email=""
    employees.departmentId=""
    employees.jobId=""
    dialogFormVisible.value=true
  }
  async function addEmployee(){
    employees.address=employees.address.toString().replace(/,/g, '');
    console.log(employees.address)
    if(employees.employeeName!=''&&employees.gender!=''){
        let  {data} =  await request.post(`employee/add`,employees)
        if(data.code==200){
            show()
        }
    }else{
          console.log("NO")
        }
  }
  async function change(row: any){
      dialogForm.value = true
      employees.employeeId=row.employeeId
      employees.employeeName=row.employeeName
      employees.gender=row.gender
      employees.address=row.address
      employees.phone=row.phone
      employees.email=row.email
      employees.departmentId=row.departmentId
      employees.jobId=row.jobId
    }
  async function updateJob(jobs: any){
  let  {data} =  await request.post(`employee/updateById`,employees)
    if(data.code==200){
        show()
    }
  console.log(jobs.jobId);
}
  const open = (row: any) => {
    ElMessageBox.confirm(
      '确认要删除吗?',
      '警告',
      {
      confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    .then(() => {
      deleteItem(row),
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })}
  async function deleteItem(row: any){
    console.log(row.employeeId,"我是ID")
    let id = row.employeeId
    let  {data} =  await request.get(`employee/deleteById?employeeId=${id}`)
    if(data.code==200){
      pageshow.value=false
        show()
    }
}
</script>
<style>
.tab{
    width: 1200px;
    margin:50px auto;
}
.bt{
    float: right;
}
h1{
  text-align: center;
  font-size:40px;
  font-family: cursive;
}
</style>
  