<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2 class="title">그룹웨어 회원가입</h2>

      <!-- 에러 메시지 표시 영역 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitSignup">
        <!-- 1. ID (사번) -->
        <div class="form-group">
          <label for="userId">사번 (ID)</label>
          <input type="number" id="userId" v-model="user.userId" required placeholder="예: 2026001" />
        </div>

        <!-- 2. 비밀번호 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="user.password" required minlength="4" placeholder="4자 이상 입력" />
        </div>

        <!-- 3. 비밀번호 확인 -->
        <div class="form-group">
          <label for="passwordConfirm">비밀번호 확인</label>
          <input type="password" id="passwordConfirm" v-model="user.passwordConfirm" required placeholder="비밀번호 다시 입력" />
        </div>

        <!-- 성과 이름 (가로 배치) -->
        <div class="form-row">
          <!-- 4. 성 -->
          <div class="form-group half">
            <label for="lastName">성</label>
            <input type="text" id="lastName" v-model="user.lastName" required placeholder="성" />
          </div>
          <!-- 5. 이름 -->
          <div class="form-group half">
            <label for="firstName">이름</label>
            <input type="text" id="firstName" v-model="user.firstName" required placeholder="이름" />
          </div>
        </div>

        <!-- 6. 외부 이메일 -->
        <div class="form-group">
          <label for="externalEmail">이메일 (외부)</label>
          <input type="email" id="externalEmail" v-model="user.externalEmail" required placeholder="example@email.com" />
        </div>

        <!-- 7. 휴대전화번호 -->
        <div class="form-group">
          <label for="phoneNumber">휴대전화번호 ('-' 제외)</label>
          <input type="tel" id="phoneNumber" v-model="user.phoneNumber" required placeholder="01012345678" />
        </div>

        <!-- 8. 거주 국가 -->
        <div class="form-group">
          <label for="country">거주 국가</label>
          <select id="country" v-model="user.country" required>
            <option v-for="country in countryList" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">가입 중...</span>
          <span v-else>가입하기</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref(''); // 커스텀 에러 메시지

// 폼 데이터 객체
const user = reactive({
  userId: '',
  password: '',
  passwordConfirm: '',
  lastName: '',
  firstName: '',
  externalEmail: '',
  phoneNumber: '',
  country: '대한민국', // 기본값 설정
});

// 거주 국가 리스트
const countryList = ['대한민국', '미국', '일본', '중국', '기타'];

// 회원가입 제출 함수
const submitSignup = async () => {
  // 초기화
  errorMessage.value = '';

  // 1. 비밀번호 일치 확인 (커스텀 유효성 검사)
  if (user.password !== user.passwordConfirm) {
    errorMessage.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  isLoading.value = true;
  
  try {
    // 백엔드 API 호출
    const response = await axios.post('http://localhost:8080/api/auth/signup', user);
    
    alert(response.data); // "회원가입이 완료되었습니다." 
    router.push('/login'); // 성공 시 로그인 페이지로 이동
    
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data; // 서버에서 온 에러 메시지 세팅
    } else {
      errorMessage.value = '서버와 통신 중 에러가 발생했습니다.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 전체 컨테이너 가운데 정렬 */
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f5f7;
  padding: 20px;
}

/* 카드 UI 디자인 */
.signup-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
}

.title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
}

/* 에러 메시지 스타일 */
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

/* 폼 그룹 및 인풋 디자인 */
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.form-row .form-group {
  margin-bottom: 0;
}

.half {
  flex: 1;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

input, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #0056b3;
}

/* 버튼 디자인 */
.submit-btn {
  width: 100%;
  padding: 12px;
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
</style>