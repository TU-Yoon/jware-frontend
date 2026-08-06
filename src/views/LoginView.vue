<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="pa-5">
      <v-card-title class="text-h5 text-center font-weight-bold mb-4">
        그룹웨어 로그인
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="userId"
            label="사번 (ID)"
            type="number"
            outlined
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="비밀번호"
            type="password"
            outlined
            required
          ></v-text-field>

          <v-btn type="submit" color="primary" block size="large" class="mt-4">
            로그인
          </v-btn>
          
          <v-btn variant="text" block class="mt-2" @click="goToSignup">
            회원가입
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios'; // 방금 만든 axios 인스턴스 가져오기

const router = useRouter();
const userId = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    // 백엔드 로그인 API 호출
    const response = await api.post('/api/auth/login', {
      userId: userId.value,
      password: password.value
    });

    // 성공 시 발급받은 토큰을 localStorage에 저장
    const token = response.data.token;
    localStorage.setItem('token', token);

    alert('로그인 성공!');
    
    // 로그인 성공 후 메인 대시보드로 이동
    router.push('/'); 
  } catch (error) {
    console.error(error);
    alert(error.response?.data || '로그인에 실패했습니다.');
  }
};

const goToSignup = () => {
  router.push('/signup');
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