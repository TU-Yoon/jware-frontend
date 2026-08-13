<template>
  <div class="login-container">
    <div class="login-card">
      
      <!-- 상단 로고 및 타이틀 영역 -->
      <div class="login-header">
        <h1 class="logo">
          <span class="logo-icon">🏢</span> JWorks
        </h1>
        <h2>로그인</h2>
        <p>JWorks 그룹웨어에 오신 것을 환영합니다.</p>
      </div>

      <!-- 로그인 폼 영역 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <input 
            type="text" 
            v-model="userId" 
            id="userId" 
            required 
            placeholder="사번 (ID)을 입력하세요" 
            class="clean-input"
          />
        </div>
        
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            id="password" 
            required 
            placeholder="비밀번호를 입력하세요" 
            class="clean-input"
          />
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" /> 아이디 저장
          </label>
        </div>

        <button type="submit" class="login-btn">로그인</button>
      </form>

      <!-- 하단 링크 영역 -->
      <div class="login-footer">
        <a href="#" class="footer-link">사번 찾기</a>
        <span class="divider">|</span>
        <a href="#" class="footer-link">비밀번호 찾기</a>
        <span class="divider">|</span>
        <router-link to="/signup" class="footer-link highlight">회원가입</router-link>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios'; // 실제 설정된 axios 경로에 맞게 수정해주세요

const userId = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await api.post('/api/users/login', {
      id: userId.value,
      password: password.value
    });
    
    // 토큰 저장 (구현 방식에 따라 다를 수 있습니다)
    localStorage.setItem('token', res.data.token);
    alert('로그인 성공!');
    router.push('/');
  } catch (error) {
    alert('사번 또는 비밀번호가 일치하지 않습니다.');
  }
};
</script>

<style scoped>
/* =========================================
   구글/네이버 스타일 모던 로그인 레이아웃
========================================= */

/* 화면 전체를 채우는 배경 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5; /* 눈이 편안한 밝은 회색 배경 */
  font-family: 'Noto Sans KR', sans-serif;
}

/* 중앙 로그인 카드 */
.login-card {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  padding: 48px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); /* 부드럽고 넓은 그림자 */
  box-sizing: border-box;
}

/* 헤더 스타일 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  color: #1a73e8; /* 구글 스타일의 신뢰감 있는 블루 */
  margin: 0 0 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.5px;
}

.logo-icon {
  font-size: 32px;
}

.login-header h2 {
  font-size: 24px;
  color: #202124;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.login-header p {
  font-size: 14px;
  color: #5f6368;
  margin: 0;
}

/* 폼 요소 스타일 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
  width: 100%;
}

.clean-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  color: #202124;
  background-color: #fff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.clean-input::placeholder {
  color: #9aa0a6;
}

/* 입력창 포커스 효과 (네이버/구글 스타일) */
.clean-input:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 8px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #5f6368;
  cursor: pointer;
}

/* 로그인 버튼 */
.login-btn {
  width: 100%;
  padding: 14px;
  background-color: #1a73e8;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  background-color: #1557b0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.login-btn:active {
  background-color: #174ea6;
}

/* 하단 링크 영역 */
.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 13px;
  color: #5f6368;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.footer-link {
  color: #5f6368;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #202124;
  text-decoration: underline;
}

.footer-link.highlight {
  color: #1a73e8;
  font-weight: bold;
}

.footer-link.highlight:hover {
  color: #1557b0;
}

.divider {
  color: #dadce0;
}
</style>