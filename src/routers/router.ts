import {createRouter,createWebHashHistory} from 'vue-router'
import {defineUser} from  '../store/userStore'
import pinia from '../pinia'

const user = defineUser(pinia)

import home from  '../components/Home.vue'
import login from  '../components/Login.vue'
import register from  '../components/Register.vue'
import employee from  '../components/Employee.vue'
import job from  '../components/Job.vue'
import department from  '../components/Department.vue'


const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            redirect:"home"
        },
        {
            path:"/login",
            component:login
        },
        {
            path:"/register",
            component:register
        },
        {
            path:"/home",
            component:home
        },
        {
            path:"/employee",
            component:employee
        },
        {
            path:"/department",
            component:department
        },
        {
            path:"/job",
            component:job
        },
    ]
})

router.beforeEach((to, from, next) => {
    if(to.path === '/home'){
        if(user.username===''){
            next("login")
        }else{
            next()
        }
    }else{
        next()
    }
})

export default router