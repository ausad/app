//存储 用户状态信息
import {defineStore} from  'pinia'



export const defineUser = defineStore(
    "user",
    {
        state:()=>{
            return{
                uid:0,
                username:""
            }                
        },
        getters:{

        },
        actions:{
            
        }
    }
)