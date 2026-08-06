<template>
  <div id="app-container">
    <!-- 좌측 사이드바: 로그인/회원가입 페이지가 아닐 때만 표시 -->
    <aside v-if="!isAuthPage" class="sidebar">
      <div class="logo">
        <h2>Groupware</h2>
      </div>
      
      <!-- 글로벌 네비게이션 (GNB) -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">대시보드</router-link>
        <router-link to="/email" class="nav-item">이메일</router-link>
        <router-link to="/memo" class="nav-item">메모장</router-link>
        <router-link to="/todo" class="nav-item">할 일 관리</router-link>
      </nav>

      <!-- 하단 로그아웃 버튼 -->
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">로그아웃</button>
      </div>
    </aside>

    <!-- 우측 메인 콘텐츠 영역 -->
    <main :class="{ 'main-content': !isAuthPage, 'full-content': isAuthPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 현재 경로가 로그인/회원가입인지 확인
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/signup';
});

// 로그아웃 로직
const handleLogout = () => {
  if(confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('token'); // 1. 브라우저 저장소에서 토큰 삭제
    alert('로그아웃 되었습니다.');
    router.push('/login'); // 2. 로그인 화면으로 쫓아내기
  }
};
</script>

<style>
/* 기존 App.vue 스타일을 그대로 유지하되, 아래 로그아웃 버튼 스타일만 추가됩니다 */
html, body {
  margin: 0; padding: 0; height: 100%; font-family: sans-serif;
}
#app-container {
  display: flex; height: 100vh; overflow: hidden;
}
.sidebar {
  width: 250px; background-color: #1e1e2d; color: #fff; display: flex; flex-direction: column;
}
.logo {
  padding: 20px; border-bottom: 1px solid #2b2b3c; text-align: center;
}
.logo h2 { margin: 0; font-size: 22px; letter-spacing: 1px; }
.nav-menu {
  display: flex; flex-direction: column; padding: 10px 0; flex: 1; /* flex:1 을 주어 메뉴가 위로 붙고, 아래 공간을 차지하게 함 */
}
.nav-item {
  padding: 15px 20px; color: #a1a1b5; text-decoration: none; font-size: 15px; transition: all 0.2s;
}
.nav-item:hover, .nav-item.router-link-active {
  background-color: #2b2b3c; color: #ffffff; border-left: 4px solid #0056b3;
}
/* 새롭게 추가된 로그아웃 영역 */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #2b2b3c;
}
.logout-btn {
  width: 100%; padding: 10px; background-color: #3a3a52; color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: 0.2s;
}
.logout-btn:hover {
  background-color: #c62828; /* 마우스 올리면 빨간색으로 경고 느낌 부여 */
}

.main-content {
  flex: 1; background-color: #f4f5f7; overflow-y: auto;
}
.full-content {
  flex: 1; width: 100%; background-color: #f4f5f7;
}
</style>