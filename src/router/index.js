import {createRouter, createWebHashHistory} from 'vue-router'
import Login from "@/views/Login";
import Register from "@/views/Register";
import ForgetPassword from "@/views/ForgetPassword";
import Home from "@/views/Home";
import Add from '@/views/Add';
import List from '@/views/List'
import Record from '@/views/BorrowingRecord'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Login_',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {auth: true},
      children: [
        {
          path: 'userInfo',
          name: 'UserInfo',
          component: () => import("@/views/UserInfo"),
          meta:{
            factor:0
          }
        },
        {
          path: '',
          redirect: '/home/userInfo'
        },
        {
          path: 'add',
          name: 'Add',
          component: Add,
          meta:{
            only:1
          }
        },
        {
          path: 'list/:page?/:size?',
          name: 'List',
          component: List,
          meta:{
            factor:0
          }
        },
        {
          path: 'record',
          name: 'Record',
          component: Record,
          meta:{
            factor:0
          }
        },
        {
          path: 'storage/record',
          name: 'StorageRecord',
          component: () => import("@/views/StorageRecord"),
          meta:{
            factor:1
          }
        },
        {
          path: 'reader/manage/:page?/:size?',
          name: 'ReaderManager',
          component: () => import("@/views/ReaderManage"),
          meta:{
            factor:1
          }
        },
        {
          path: 'emp/manage/:page?/:size?',
          name: 'EmpManage',
          component: () => import("@/views/EmpManage"),
          meta:{
            factor:2
          }
        },
        {
          path: 'type/manage/:page?/:size?',
          name: 'TypeManage',
          component: () => import("@/views/TypeManage"),
          meta:{
            factor:1
          }
        },
        {
          path: 'borrow/return/book',
          name: 'BorrowReturnBook',
          component: () => import("@/views/BorrowReturnBook"),
          meta:{
            factor:1
          }
        },
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      // /error/错误信息/上一级路径
      path: "/error/:massage?/:from?",
      name: "Error",
      component: () => import('@/views/error/error')
    },
    {
      path: "/404/:from?",
      name: "404",
      component: () => import('@/views/error/404')
    },
    {
      // vue3 改动!
      path: "/:pathMatch(.*)*",
      redirect: '/404'
    },
  ]
})

export default router
