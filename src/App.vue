<template>
  <v-app>
    <!-- 1. 왼쪽 글로벌 사이드바 (로그인 화면이 아닐 때만 표시) -->
    <v-navigation-drawer 
      v-if="!isLoginPage" 
      permanent 
      color="blue-grey-darken-4" 
      width="260"
    >
      <!-- 로고 & 프로필 영역 -->
      <div class="pa-5 border-b border-blue-grey-darken-3">
        <h2 class="text-h5 font-weight-black text-white d-flex align-center" @click="router.push('/main')">
          <v-icon class="mr-2" color="primary" size="small">mdi-domain</v-icon>
          JWorks
        </h2>
        <div class="text-caption text-grey-lighten-1 mt-2" v-if="currentUser">
          접속 중: 사번 {{ currentUser.id }} 님
        </div>
      </div>

      <!-- 메인 메뉴 리스트 -->
      <v-list nav class="px-2 mt-2">
        <v-list-item to="/main" prepend-icon="mdi-view-dashboard" title="홈 대시보드" value="home" color="primary" rounded="lg"></v-list-item>
        <v-list-item to="/email" prepend-icon="mdi-email" title="이메일" value="email" color="primary" rounded="lg"></v-list-item>
        <v-list-item to="/todo" prepend-icon="mdi-check-circle-outline" title="할 일 관리" value="todo" color="primary" rounded="lg"></v-list-item>
        <v-list-item to="/memo" prepend-icon="mdi-note-text" title="메모장" value="memo" color="primary" rounded="lg"></v-list-item>
      </v-list>
      
      <!-- 하단 로그아웃 버튼 -->
      <template v-slot:append>
        <div class="pa-4 border-t border-blue-grey-darken-3">
          <v-btn block color="error" variant="tonal" @click="logout" prepend-icon="mdi-logout">
            로그아웃
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- 2. 상단 헤더 (현재 어떤 페이지인지 표시) -->
    <v-app-bar v-if="!isLoginPage" elevation="0" border="b" color="white">
      <v-app-bar-title class="text-subtitle-1 font-weight-bold">
        {{ currentRouteName }}
      </v-app-bar-title>
    </v-app-bar>

    <!-- 3. 실제 페이지(View)들이 렌더링될 메인 공간 -->
    <v-main class="bg-grey-lighten-4">
      <!-- 페이지 안쪽 여백 설정 -->
      <div class="pa-6 h-100">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 현재 로그인한 사용자 정보
const currentUser = computed(() => JSON.parse(localStorage.getItem('user')))

// 라우터 주소가 '/' (로그인 화면)이면 사이드바를 숨기기 위함
const isLoginPage = computed(() => route.path === '/')

// 상단 헤더에 표시할 현재 메뉴 이름
const currentRouteName = computed(() => {
  switch (route.path) {
    case '/main': return '홈 대시보드'
    case '/email': return '이메일'
    case '/todo': return '할 일 관리'
    case '/memo': return '메모장'
    default: return 'Jware Workspace'
  }
})

// 로그아웃 함수 (App.vue로 통합)
const logout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('user')
    router.push('/')
  }
}
</script>