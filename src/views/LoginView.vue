<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">그룹웨어 로그인</h2>

      <!-- 에러 메시지 표시 영역 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitLogin">
        <!-- ID (사번) -->
        <div class="form-group">
          <label for="userId">사번 (ID)</label>
          <input 
            type="number" 
            id="userId" 
            v-model="loginData.userId" 
            required 
            placeholder="사번을 입력하세요" 
          />
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginData.password" 
            required 
            placeholder="비밀번호를 입력하세요" 
          />
        </div>

        <!-- 로그인 버튼 -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">로그인 중...</span>
          <span v-else>로그인</span>
        </button>
      </form>

      <div class="signup-link">
        계정이 없으신가요? <router-link to="/signup">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

// 로그인 폼 데이터
const loginData = reactive({
  userId: '',
  password: ''
});

// 로그인 제출 함수
const submitLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  
  try {
    // 백엔드 로그인 API 호출 (아직 백엔드는 안 만들었습니다!)
    const response = await axios.post('http://localhost:8080/api/auth/login', loginData);
    
    // 성공 시 발급받은 JWT 토큰을 브라우저 로컬 스토리지에 저장
    const token = response.data.token;
    localStorage.setItem('jwt_token', token);
    
    // axios 기본 헤더에 토큰 등록 (이후 모든 요청에 자동으로 토큰 포함)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    alert('로그인에 성공했습니다.');
    router.push('/'); // 메인 대시보드로 이동
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = '사번 또는 비밀번호가 올바르지 않습니다.';
    } else {
      errorMessage.value = '서버와 통신 중 에러가 발생했습니다.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 회원가입 화면과 동일한 스타일 적용 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f5f7;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #0056b3;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #004494;
}

.submit-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.signup-link a {
  color: #0056b3;
  font-weight: bold;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>