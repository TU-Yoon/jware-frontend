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
    </aside>

    <!-- 우측 메인 콘텐츠 영역 (페이지가 렌더링되는 곳) -->
    <main :class="{ 'main-content': !isAuthPage, 'full-content': isAuthPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// 현재 라우터 정보를 가져옵니다.
const route = useRoute();

// 현재 경로가 로그인(/login)이거나 회원가입(/signup)인지 확인하여 사이드바 숨김 처리
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/signup';
});
</script>

<style>
/* 1. 기본 브라우저 여백 초기화 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}

/* 2. 전체 레이아웃 틀 (가로 배치) */
#app-container {
  display: flex;
  height: 100vh; /* 화면 꽉 차게 */
  overflow: hidden;
}

/* 3. 좌측 사이드바 스타일 (슬랙/네이버웍스 스타일의 어두운 테마) */
.sidebar {
  width: 250px;
  background-color: #1e1e2d;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #2b2b3c;
  text-align: center;
}

.logo h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}

.nav-item {
  padding: 15px 20px;
  color: #a1a1b5;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
}

/* 메뉴에 마우스를 올리거나, 현재 페이지일 때의 하이라이트 효과 */
.nav-item:hover, .nav-item.router-link-active {
  background-color: #2b2b3c;
  color: #ffffff;
  border-left: 4px solid #0056b3; /* 파란색 포인트 라인 */
}

/* 4. 메인 콘텐츠 영역 (사이드바가 있을 때) */
.main-content {
  flex: 1;
  background-color: #f4f5f7;
  overflow-y: auto; /* 내용이 길어지면 우측 영역만 스크롤되도록 처리 */
}

/* 5. 전체 화면 영역 (로그인/회원가입 등 사이드바가 없을 때) */
.full-content {
  flex: 1;
  width: 100%;
  background-color: #f4f5f7;
}
</style>