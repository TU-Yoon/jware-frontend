<template>
  <div id="app-container">
    <!-- 좌측 사이드바: computedSidebarWidth로 동적 너비 적용 -->
    <aside 
      v-if="!isAuthPage" 
      class="sidebar" 
      :class="{ 'collapsed': isCollapsed }"
      :style="{ width: computedSidebarWidth + 'px' }"
    >
      <div class="logo">
        <router-link to="/" class="logo-link">
          <h2 v-if="!isCollapsed">Groupware</h2>
          <h2 v-else title="Groupware">GW</h2>
        </router-link>
      </div>
      
      <!-- 글로벌 네비게이션 (GNB) -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" title="대시보드">
          <span class="icon">🏠</span>
          <span v-if="!isCollapsed" class="text">대시보드</span>
        </router-link>
        <router-link to="/email" class="nav-item" title="이메일">
          <span class="icon">📧</span>
          <span v-if="!isCollapsed" class="text">이메일</span>
        </router-link>
        <router-link to="/memo" class="nav-item" title="메모장">
          <span class="icon">📝</span>
          <span v-if="!isCollapsed" class="text">메모장</span>
        </router-link>
        <router-link to="/todo" class="nav-item" title="할 일 관리">
          <span class="icon">✅</span>
          <span v-if="!isCollapsed" class="text">할 일 관리</span>
        </router-link>
      </nav>

      <!-- 하단 로그아웃 버튼 -->
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn" title="로그아웃">
          <span v-if="!isCollapsed">로그아웃</span>
          <span v-else class="icon">🚪</span>
        </button>
      </div>

      <!-- 크기 조절을 위한 우측 경계선 (핸들) -->
      <div 
        v-if="!isCollapsed" 
        class="resizer" 
        @mousedown="startResize"
      ></div>
    </aside>

    <!-- 우측 메인 콘텐츠 영역 -->
    <main :class="{ 'main-content': !isAuthPage, 'full-content': isAuthPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// --- 1. 로그인/회원가입 페이지 확인 ---
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/signup';
});

// --- 2. 사이드바 반응형 (축소) 로직 ---
const windowWidth = ref(window.innerWidth);

// 창 크기가 바뀔 때마다 너비 업데이트
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

// 브라우저 창 너비가 768px 미만이면 아이콘 모드(collapsed)로 전환
const isCollapsed = computed(() => windowWidth.value < 768);

// --- 3. 사이드바 드래그 크기 조절 로직 ---
const sidebarWidth = ref(250); // 기본 너비
const isResizing = ref(false);

// 실제 적용될 너비 (축소 모드일 때는 70px 고정)
const computedSidebarWidth = computed(() => {
  if (isCollapsed.value) return 70;
  return sidebarWidth.value;
});

const startResize = () => {
  isResizing.value = true;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
  // 드래그 중일 때 텍스트 드래그 방지 및 마우스 커서 고정
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const resize = (e) => {
  if (!isResizing.value) return;
  // 마우스 X 좌표에 따라 너비 조절 (최소 180px, 최대 400px 제한)
  let newWidth = e.clientX;
  if (newWidth < 180) newWidth = 180;
  if (newWidth > 400) newWidth = 400;
  sidebarWidth.value = newWidth;
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
  // 드래그 종료 후 원상복구
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// --- 4. 로그아웃 로직 ---
const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    router.push('/login');
  }
};
</script>

<style>
/* 기본 리셋 */
html, body {
  margin: 0; padding: 0; height: 100%; font-family: 'Noto Sans KR', sans-serif;
}
#app-container {
  display: flex; height: 100vh; overflow: hidden;
}

/* 사이드바 기본 설정 */
.sidebar {
  background-color: #1e1e2d; color: #fff; display: flex; flex-direction: column;
  position: relative; /* resizer 절대 배치를 위해 필요 */
  transition: width 0.1s ease; /* 너비 변경 시 약간의 부드러움 추가 */
}

/* 크기 조절 핸들 (우측 경계선) */
.resizer {
  width: 5px;
  cursor: col-resize;
  position: absolute;
  top: 0; right: 0; bottom: 0;
  background-color: transparent;
  transition: background-color 0.2s;
}
.resizer:hover, .resizer:active {
  background-color: #0056b3; /* 마우스 올리면 파란색 선 표시 */
}

/* 로고 영역 */
.logo {
  padding: 20px; border-bottom: 1px solid #2b2b3c; text-align: center;
  white-space: nowrap; overflow: hidden;
}
.logo-link {
  color: #fff; text-decoration: none; display: block;
}
.logo h2 { margin: 0; font-size: 22px; letter-spacing: 1px; }

/* 네비게이션 메뉴 */
.nav-menu {
  display: flex; flex-direction: column; padding: 10px 0; flex: 1;
}
.nav-item {
  padding: 15px 20px; color: #a1a1b5; text-decoration: none; font-size: 15px;
  display: flex; align-items: center; white-space: nowrap; overflow: hidden;
}
.nav-item:hover, .nav-item.router-link-active {
  background-color: #2b2b3c; color: #ffffff; border-left: 4px solid #0056b3;
}
.nav-item .icon {
  font-size: 18px; margin-right: 12px;
}
.nav-item .text {
  flex: 1;
}

/* 로그아웃 버튼 영역 */
.sidebar-footer {
  padding: 20px; border-top: 1px solid #2b2b3c; text-align: center;
}
.logout-btn {
  width: 100%; padding: 10px; background-color: #3a3a52; color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 14px;
  display: flex; justify-content: center; align-items: center;
}
.logout-btn:hover {
  background-color: #c62828;
}

/* --- 축소 모드(Collapsed) 특화 스타일 --- */
.sidebar.collapsed .logo { padding: 20px 0; }
.sidebar.collapsed .nav-item { padding: 15px 0; justify-content: center; }
.sidebar.collapsed .nav-item .icon { margin-right: 0; font-size: 22px; }
.sidebar.collapsed .sidebar-footer { padding: 10px; }

/* 메인 콘텐츠 */
.main-content {
  flex: 1; background-color: #f4f5f7; overflow-y: auto;
}
.full-content {
  flex: 1; width: 100%; background-color: #f4f5f7;
}
</style>