<template>
  <div id="app-container">
    <!-- 얇은 사이드바 -->
    <aside v-if="!isAuthPage" class="sidebar-thin">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <h2 title="Groupware">GW</h2>
        </router-link>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" title="대시보드">
          <span class="icon">🏠</span>
          <span class="text">대시보드</span>
        </router-link>
        <router-link to="/email" class="nav-item" title="이메일">
          <span class="icon">📧</span>
          <span class="text">이메일</span>
        </router-link>
        <router-link to="/memo" class="nav-item" title="메모장">
          <span class="icon">📝</span>
          <span class="text">메모장</span>
        </router-link>
        <router-link to="/todo" class="nav-item" title="할 일 관리">
          <span class="icon">✅</span>
          <span class="text">할 일 관리</span>
        </router-link>
      </nav>

      <!-- 하단 버튼 영역 -->
      <div class="sidebar-footer">
        <button @click="toggleTheme" class="footer-icon-btn" :title="isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <!-- 기존 사이드바 하단 로그아웃 버튼 유지 (필요 시 제거 가능) -->
        <button @click="handleLogout" class="footer-icon-btn logout" title="로그아웃">
          🚪
        </button>
      </div>
    </aside>

    <!-- 메인 콘텐츠 -->
    <main :class="{ 'main-content': !isAuthPage, 'full-content': isAuthPage }">
      
      <!-- 우측 상단 공통 헤더 -->
      <header v-if="!isAuthPage" class="top-header">
        <div class="header-left">
          <!-- 임직원 검색 상자 -->
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="임직원 검색..." class="search-input" />
          </div>
        </div>
        
        <div class="header-right">
          <button class="icon-btn" title="알림">🔔</button>
          
          <!-- 프로필 래퍼 (팝업 기준점) -->
          <div class="profile-wrapper">
            <!-- 프로필 아이콘 (클릭 시 팝업 토글) -->
            <div class="profile-trigger" @click="toggleProfilePopup">
              <div class="header-avatar">윤</div>
              <span class="header-name">윤태웅 님</span>
            </div>

            <!-- 지메일 스타일 계정 관리 팝업 -->
            <div v-if="showProfilePopup" class="profile-popup">
              <div class="popup-header">
                <span class="popup-email">taeung@jworks.com</span>
                <button class="close-btn" @click="showProfilePopup = false">✕</button>
              </div>

              <div class="popup-body">
                <div class="popup-avatar-large">윤</div>
                <div class="popup-greeting">안녕하세요, 태웅님.</div>

                <!-- 여기서 계정 관리(ProfileView)로 이동합니다 -->
                <router-link to="/profile" class="manage-account-btn" @click="showProfilePopup = false">
                  Groupware 계정 관리
                </router-link>
              </div>

              <div class="popup-footer">
                <button class="popup-action-btn">
                  <span class="icon">➕</span> 계정 추가
                </button>
                <button class="popup-action-btn" @click="handleLogout">
                  <span class="icon">🚪</span> 로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isAuthPage = computed(() => route.path === '/login' || route.path === '/signup');

// --- 프로필 팝업 상태 관리 ---
const showProfilePopup = ref(false);

const toggleProfilePopup = () => {
  showProfilePopup.value = !showProfilePopup.value;
};

// --- 다크 모드 / 라이트 모드 테마 로직 ---
const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  isDarkMode.value = savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
});

// --- 로그아웃 로직 ---
const handleLogout = () => {
  showProfilePopup.value = false; // 로그아웃 시 팝업 닫기
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    router.push('/login');
  }
};
</script>

<style>
/* =========================================
   전역 CSS 변수 (테마 색상 팔레트)
========================================= */
:root {
  --bg-main: #f4f5f7;
  --bg-sidebar: #1e1e2d;
  --text-main: #333;
  --text-sidebar: #a1a1b5;
  --sidebar-hover: #2b2b3c;
  --border-color: #e0e0e0;
  --card-bg: #ffffff;
  --input-bg: #ffffff;
  --text-muted: #666;
  --popup-hover: #f1f3f4;
}

[data-theme="dark"] {
  --bg-main: #121212;
  --bg-sidebar: #000000;
  --text-main: #e0e0e0;
  --text-sidebar: #888;
  --sidebar-hover: #1a1a1a;
  --border-color: #333333;
  --card-bg: #1e1e1e;
  --input-bg: #2a2a2a;
  --text-muted: #aaaaaa;
  --popup-hover: #2a2a2a;
}

html, body { margin: 0; padding: 0; height: 100%; font-family: 'Noto Sans KR', sans-serif; background-color: var(--bg-main); color: var(--text-main); transition: background-color 0.3s, color 0.3s; }
#app-container { display: flex; height: 100vh; overflow: hidden; }

/* 얇은 사이드바 */
.sidebar-thin { width: 80px; min-width: 80px; background-color: var(--bg-sidebar); display: flex; flex-direction: column; border-right: 1px solid var(--sidebar-hover); z-index: 100; }
.logo { padding: 20px 0; border-bottom: 1px solid var(--sidebar-hover); text-align: center; }
.logo-link { color: #fff; text-decoration: none; display: block; }
.logo h2 { margin: 0; font-size: 20px; letter-spacing: 1px; color: #fff; }
.nav-menu { display: flex; flex-direction: column; padding: 15px 0; flex: 1; align-items: center; gap: 15px; }
.nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 64px; height: 60px; color: var(--text-sidebar); text-decoration: none; border-radius: 12px; transition: all 0.2s; }
.nav-item:hover { background-color: var(--sidebar-hover); color: #ffffff; }
.nav-item.router-link-active { background-color: rgba(0, 86, 179, 0.2); color: #64b5f6; font-weight: bold; }
.nav-item .icon { font-size: 22px; margin-bottom: 4px; }
.nav-item .text { font-size: 11px; text-align: center; }
.sidebar-footer { padding: 15px 0; text-align: center; display: flex; flex-direction: column; gap: 15px; align-items: center; border-top: 1px solid var(--sidebar-hover); }
.footer-icon-btn { width: 44px; height: 44px; border-radius: 50%; background-color: transparent; color: var(--text-sidebar); border: none; cursor: pointer; font-size: 18px; display: flex; justify-content: center; align-items: center; transition: 0.2s; }
.footer-icon-btn:hover { background-color: var(--sidebar-hover); color: #fff; }
.footer-icon-btn.logout:hover { background-color: rgba(211, 47, 47, 0.2); color: #ef5350; }

/* 메인 콘텐츠 및 헤더 */
.main-content { flex: 1; display: flex; flex-direction: column; background-color: var(--bg-main); overflow: hidden; transition: background-color 0.3s; }
.full-content { flex: 1; width: 100%; background-color: var(--bg-main); }
.top-header { height: 60px; background-color: var(--card-bg); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; padding: 0 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); z-index: 10; }
.search-box { display: flex; align-items: center; background-color: var(--bg-main); border-radius: 24px; padding: 6px 16px; width: 250px; border: 1px solid var(--border-color); transition: box-shadow 0.2s; }
.search-box:focus-within { background-color: var(--card-bg); box-shadow: 0 1px 4px rgba(0,0,0,0.1); border-color: #0056b3; }
.search-icon { font-size: 14px; margin-right: 8px; opacity: 0.6; }
.search-input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: var(--text-main); }
.search-input::placeholder { color: var(--text-muted); }
.header-right { display: flex; align-items: center; gap: 20px; }
.icon-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-main); padding: 5px; opacity: 0.7; transition: 0.2s; }
.icon-btn:hover { opacity: 1; }

/* =========================================
   프로필 래퍼 및 팝업 (지메일 스타일)
========================================= */
.profile-wrapper { position: relative; }

.profile-trigger { 
  display: flex; align-items: center; gap: 10px; cursor: pointer; 
  padding: 4px 8px; border-radius: 20px; transition: background-color 0.2s; 
}
.profile-trigger:hover { background-color: var(--bg-main); }

.header-avatar { width: 32px; height: 32px; border-radius: 50%; background-color: #0056b3; color: white; display: flex; justify-content: center; align-items: center; font-size: 14px; font-weight: bold; }
.header-name { font-size: 14px; font-weight: bold; color: var(--text-main); user-select: none; }

/* 팝업 컨테이너 */
.profile-popup {
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  background-color: var(--card-bg);
  border-radius: 20px; /* 지메일처럼 둥글게 */
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  border: 1px solid var(--border-color);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
[data-theme="dark"] .profile-popup { box-shadow: 0 4px 20px rgba(0,0,0,0.6); }

/* 팝업 상단 (이메일 및 닫기 버튼) */
.popup-header { display: flex; justify-content: center; align-items: center; padding: 15px; position: relative; }
.popup-email { font-size: 13px; font-weight: bold; color: var(--text-main); }
.close-btn { position: absolute; right: 15px; background: none; border: none; font-size: 16px; color: var(--text-muted); cursor: pointer; padding: 5px; border-radius: 50%; transition: background-color 0.2s; }
.close-btn:hover { background-color: var(--popup-hover); }

/* 팝업 중앙 (큰 아바타, 인사말, 관리 버튼) */
.popup-body { display: flex; flex-direction: column; align-items: center; padding: 10px 20px 25px 20px; }
.popup-avatar-large { width: 72px; height: 72px; border-radius: 50%; background-color: #0056b3; color: white; font-size: 32px; font-weight: bold; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; }
.popup-greeting { font-size: 18px; color: var(--text-main); margin-bottom: 20px; font-weight: 500; }
.manage-account-btn { padding: 10px 20px; border: 1px solid var(--border-color); border-radius: 24px; background-color: transparent; color: var(--text-main); text-decoration: none; font-weight: bold; font-size: 14px; transition: background-color 0.2s; }
.manage-account-btn:hover { background-color: var(--popup-hover); }

/* 팝업 하단 (추가 작업 버튼) */
.popup-footer { display: flex; border-top: 1px solid var(--border-color); }
.popup-action-btn { flex: 1; padding: 16px; background-color: transparent; border: none; color: var(--text-main); font-weight: bold; font-size: 13px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; transition: background-color 0.2s; }
.popup-action-btn:hover { background-color: var(--popup-hover); }
.popup-action-btn:first-child { border-right: 1px solid var(--border-color); }

.content-wrapper { flex: 1; overflow-y: auto; }
</style>