<template>
    <div class="tab">
      <el-button @click="deleteSelectedRows">删除选中行</el-button>

      <el-button class="bt" plain @click="add()">新增岗位</el-button>
    <el-table :data="tableData" :key="itemkey" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="jobId" label="岗位编号" width="180" />
      <el-table-column prop="jobTitle" label="岗位名称" width="180" />
      <el-table-column prop="salary" label="薪资标准" />
      <el-table-column prop="responsibilities" label="岗位信息" />
      <el-table-column  label="操作">
        <template #default="{ row }">
          <el-button type="primary" plain @click="change(row)">修改</el-button>
          <el-button type="danger" plain @click="open(row)">取消岗位</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" width="500px" title="新增部门">
    <el-form :model="jobs">
      <el-form-item label="岗位名称" :label-width="formLabelWidth">
        <el-input v-model="jobs.jobTitle" autocomplete="off" />
      </el-form-item>
      <el-form-item label="薪资标准" :label-width="formLabelWidth">
        <el-input v-model="jobs.salary" autocomplete="off" />
      </el-form-item>
      <el-form-item label="岗位信息" :label-width="formLabelWidth">
        <el-input v-model="jobs.responsibilities" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addJob();dialogFormVisible = false">
          确认
        </el-button>
      </span>
    </template>
    </el-dialog>

    <el-dialog v-model="dialogForm" width="500px" title="修改部门">
    <el-form :model="jobs">
      <el-form-item label="岗位id" :label-width="formLabelWidth">
        <el-input v-model="jobs.jobId" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="岗位名称" :label-width="formLabelWidth">
        <el-input v-model="jobs.jobTitle" autocomplete="off" />
      </el-form-item>
      <el-form-item label="薪资标准" :label-width="formLabelWidth">
        <el-input v-model="jobs.salary" autocomplete="off" />
      </el-form-item>
      <el-form-item label="岗位信息" :label-width="formLabelWidth">
        <el-input v-model="jobs.responsibilities" autocomplete="off" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogForm = false">取消</el-button>
        <el-button type="primary" @click="updateJob(jobs);dialogForm = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  </template>
  
  <script lang="ts" setup> 
  import { ref,reactive,onMounted } from 'vue';
  import request from '../utils/request'
  import { ElMessage, ElMessageBox } from 'element-plus'
  //响应式实现双向绑定实时更新表格内容
  let tableData=ref([])
  let itemkey =ref()
  let dialogFormVisible = ref(false)
  let dialogForm = ref(false)
  let selectedRows= ref([])
  const formLabelWidth = '130px'
  onMounted(()=>{
        show()
    })
  async function show(){
      let {data} = await request.get(`job/find`)
      tableData=data.data
      itemkey.value=Math.random()
      console.log(tableData);
  }
  let jobs = reactive({
    jobId:'',
    jobTitle: '',
    salary: '',
    responsibilities: ''
    })
  function handleSelectionChange(selection:any) {
  selectedRows.value = selection;
  }
  function deleteSelectedRows() {
      for (let i = 0; i < selectedRows.value.length; i++) {
        deleteItem(selectedRows.value[i])
      }
  }
  function add(){
    jobs.jobId=""
    jobs.jobTitle=""
    jobs.salary=""
    jobs.responsibilities=""
    dialogFormVisible.value=true
  }
  async function addJob(){
    if(jobs.jobTitle!=''&&jobs.salary!=''){
        let  {data} =  await request.post(`job/add`,jobs)
        if(data.code==200){
            show()
        }
    }else{
          console.log("NO")
        }
  }
  async function change(row: any){
      dialogForm.value = true
      jobs.jobId=row.jobId
      jobs.jobTitle=row.jobTitle
      jobs.salary=row.salary
      jobs.responsibilities=row.responsibilities
    }
  async function updateJob(jobs: any){
    let  {data} =  await request.post(`job/updateById`,jobs)
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
      console.log(row.jobId,"我是ID")
      let id = row.jobId
      let  {data} =  await request.get(`job/deleteById?jobId=${id}`)
      if(data.code==200){
          show()
      }
  }
</script>

<style>
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.bt{
    float: right;
}
</style>
  