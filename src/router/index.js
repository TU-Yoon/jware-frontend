// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MemoView from '../views/MemoView.vue'
import TodoView from '../views/TodoView.vue' // 🚨 1. 파일 불러오기
import MainView from '../views/MainView.vue'
import SignupView from '../views/SignupView.vue'
import EmailView from '@/views/EmailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/memo',
      name: 'memo',
      component: MemoView
    },
    {
      path: '/todo', // 🚨 2. 할 일 목록 주소 추가
      name: 'todo',
      component: TodoView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/email',
      name: 'email',
      component: EmailView
    }
  ]
})

export default router