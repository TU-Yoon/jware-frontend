<template>
    <v-container>
        <v-card-title class="text-center text-h1 font-weight-bold mt-5">
            Jworks Login
        </v-card-title>
    </v-container>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="400" elevation="5" class="pa-5" rounded="xl">
            <v-card-title class="text-center text-h5 font-weight-bold mb-4">
                환영합니다
            </v-card-title>

            <v-card-text>
                <v-text-field v-model="username" label="아이디" variant="outlined" dense rounded="lg"></v-text-field>
                <v-text-field v-model="password" label="비밀번호" type="password" variant="outlined" dense rounded="lg" @keyup.enter="login"></v-text-field>

                <v-btn color="primary" block size="large" class="mt-2" rounded="lg" @click="login">로그인</v-btn>
                <!-- LoginView.vue 의 로그인 버튼 바로 아래에 추가 -->
                <v-btn color="secondary" variant="outlined" block size="large" class="mt-3" rounded="lg" @click="router.push('/signup')">
                    회원가입
                </v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
    if (!username.value || !password.value) {
        alert('아이디와 비밀번호를 입력해주세요.')
        return
    }

    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            username: username.value,
            password: password.value
        })

        //로그인 성공 시 백엔드에서 받은 사용자 정보(id, name 등)을 브라우저에 임시 저장
        localStorage.setItem('user', JSON.stringify(response.data))

        alert(`${response.data.name}님, 환영합니다!`)

        router.push('/main')

    } catch (error) {
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    }
}
</script>