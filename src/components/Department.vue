<template>
  <el-text class="mx-1" type="primary"><h1>部门管理</h1></el-text>
    <div class="tab">
        <el-button @click="deleteSelectedRows">删除选中行</el-button>
        <el-button class="bt"  plain @click="add()">新增部门</el-button>
    <el-table :data="tableData" :key="itemkey" stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="departmentId" label="部门编号" width="180" />
        <el-table-column prop="departmentName" label="部门" width="180" />
        <el-table-column prop="managerId" label="部门管理者" />
        <el-table-column  label="操作">
            <template #default="{ row }">
                <el-button type="primary" plain @click="change(row)">修改</el-button>
                <el-button type="danger" plain @click="open(row)">解散部门</el-button>
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
    <el-form :model="departments">
      <el-form-item label="部门名称" :label-width="formLabelWidth">
        <el-input v-model="departments.departmentName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门管理者" :label-width="formLabelWidth">
        <el-input v-model="departments.managerId" autocomplete="off" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addDepartment();dialogFormVisible = false">
          确认
        </el-button>
      </span>
    </template>
    </el-dialog>

    <el-dialog v-model="dialogForm" width="500px" title="修改部门">
    <el-form :model="departments">
      <el-form-item label="部门id" :label-width="formLabelWidth">
        <el-input v-model="departments.departmentId" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门名称" :label-width="formLabelWidth">
        <el-input v-model="departments.departmentName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门管理者" :label-width="formLabelWidth">
        <el-input v-model="departments.managerId" autocomplete="off" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogForm = false">取消</el-button>
        <el-button type="primary" @click="updateDepartment(departments);dialogForm = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
    import { defineDepartment } from '../store/departmentStore';
    import { ref,reactive,watch,computed,onMounted } from 'vue';
    import request from '../utils/request'
    import { ElConfigProvider ,ElMessage, ElMessageBox } from 'element-plus'
    import zhCn from "element-plus/es/locale/lang/zh-cn";
    let itemkey =ref()
    //关于分页// 创建响应式变量
    let currentPage = ref(1); //当前页面
    let pageSize = ref(5) // 每页显示的数据条数
    let total = 100; // 总数据条数
    //刷新页面（很重要）
    let pageshow = ref(false)
    //数组接收后端数据
    const dataList = ref([]);
    //响应式实现双向绑定实时更新表格内容
    let tableData = computed(getList);
    let selectedRows= ref([])
    let lastPage = ref(1)
    let dialogFormVisible = ref(false)
    let dialogForm = ref(false)
    const formLabelWidth = '130px'
    let departments = reactive({
        departmentId:'',
        departmentName: '',
        managerId: ''
    })
    // 计算当前页显示的数据
function getList() {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return dataList.value.slice(start, end);
    }

//删除多行数据
function handleSelectionChange(selection:any) {
  selectedRows.value = selection;
}
function deleteSelectedRows() {
    for (let i = 0; i < selectedRows.value.length; i++) {
      deleteItem(selectedRows.value[i])
    }
    show()
}
    async function deleteItem(row: any){
        console.log(row.departmentId,"我是ID")
        let id = row.departmentId
        let  {data} =  await request.get(`department/deleteById?departmentId=${id}`)
        if(data.code==200){
          pageshow.value=false
          show()
        }
    }
    async function change(row: any){
      dialogForm.value = true
      departments.departmentId=row.departmentId
      departments.departmentName=row.departmentName
      departments.managerId=row.managerId
    }
    async function updateDepartment(depdepartments: any){
      let  {data} =  await request.post(`department/updateById`,depdepartments)
        if(data.code==200){
          pageshow.value=false
            show()
        }
      console.log(depdepartments.departmentId);
    }
    function add(){
      departments.departmentId=''
      departments.departmentName=''
      departments.managerId=''
      dialogFormVisible.value = true
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
    })
}
    //挂载后获取数据（异步）
    let department = defineDepartment()
    onMounted(()=>{
        show()
    })

    watch(dataList, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        total = newVal.length; // 更新 total 变量
      }
    });

    //获取数据展示在表格
    async function show(){
        let {data} = await request.get(`department/find`)
        department.itemList=data.data
        dataList.value=data.data
        total=data.data.length
        pageshow.value=true        
        itemkey.value=Math.random()
        
      lastPage.value= Math.ceil((total - 1) / pageSize.value);
      console.log(lastPage.value)
      currentPage.value = lastPage.value < currentPage.value ? lastPage.value : currentPage.value;
    }
    async function addDepartment(){
      if(departments.departmentName!=''){
          let  {data} =  await request.post(`department/add`,departments)
          if(data.code==200){
            pageshow.value=false
              show()
          }
      }else{
              console.log("NO")
          }
    }
</script>
<style>
.page{
  width: 500px;
  margin:50px 250px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
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
  