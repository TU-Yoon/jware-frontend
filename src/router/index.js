// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MemoView from '../views/MemoView.vue'
import TodoView from '../views/TodoView.vue' // 🚨 1. 파일 불러오기
import MainView from '../views/MainView.vue'
import SignupView from '../views/SignupView.vue'
import EmailView from '@/views/EmailView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

// 전역 라우터 가드 (화면 이동 전에 항상 실행됨)
router.beforeEach((to, from, next) => {
  // localStorage에서 토큰 확인
  const isAuthenticated = !!localStorage.getItem('token'); 
  
  // 로그인 없이 접근 가능한 페이지 목록
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);

  // 인증이 필요한 페이지인데 토큰이 없다면 무조건 로그인 페이지로 강제 이동
  if (authRequired && !isAuthenticated) {
    next('/login');
  } else {
    next(); // 통과!
  }
});

export default router