<!-- src/views/SignupView.vue -->
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" elevation="5" class="pa-5">
      <v-card-title class="text-center text-h5 font-weight-bold mb-4">
        Jware 회원가입
      </v-card-title>

      <v-card-text>
        <v-text-field 
          v-model="form.username" 
          label="사용할 아이디" 
          variant="outlined" 
          dense
          class="mb-2"
        ></v-text-field>
        
        <v-text-field 
          v-model="form.password" 
          label="비밀번호" 
          type="password" 
          variant="outlined" 
          dense
          class="mb-2"
        ></v-text-field>

        <v-text-field 
          v-model="form.passwordConfirm" 
          label="비밀번호 확인" 
          type="password" 
          variant="outlined" 
          dense
          class="mb-2"
        ></v-text-field>

        <v-text-field 
          v-model="form.name" 
          label="이름 (예: 홍길동)" 
          variant="outlined" 
          dense
          @keyup.enter="signup"
        ></v-text-field>
        
        <v-btn color="success" block size="large" class="mt-4" @click="signup">
          가입하기
        </v-btn>
        <v-btn color="grey-darken-1" variant="text" block class="mt-2" @click="goBack">
          로그인 화면으로 돌아가기
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 입력받을 데이터 꾸러미
const form = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
  name: ''
})

const signup = async () => {
  // 1. 빈칸 검사
  if (!form.username || !form.password || !form.name) {
    alert('모든 항목을 입력해주세요.')
    return
  }

  // 2. 비밀번호 일치 검사
  if (form.password !== form.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  try {
    // 3. 백엔드로 회원가입 요청
    const response = await axios.post('http://localhost:8080/api/auth/signup', {
      username: form.username,
      password: form.password,
      name: form.name
    })

    if (response.data === 'success') {
      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      router.push('/') // 로그인 화면으로 이동
    }
  } catch (error) {
    console.error(error)
    alert('회원가입 중 오류가 발생했습니다. 아이디가 중복되었을 수 있습니다.')
  }
}

const goBack = () => {
  router.push('/')
}
</script>