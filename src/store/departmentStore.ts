//存储 部门状态信息
import {defineStore} from  'pinia'


export const defineDepartment = defineStore(
    "department",
    {
        state:()=>{
            return{
                itemList:[]
            }                
        },
        getters:{

        },
        actions:{
            
        }
    }
)