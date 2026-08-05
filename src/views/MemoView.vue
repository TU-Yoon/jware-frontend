
<template>
    <v-container max-width="800">
        <!-- 상단 헤더 영역 -->
        <div class="d-flex justify-space-between align-center w-100 mb-6 mt-4">
            <h1 class="text-h4 font-weight-bold">나의 메모장</h1>
            <v-btn color="error" variant="tonal" @click="router.push('/main')">메인페이지</v-btn>
        </div>

        <!-- 메모 작성 영역 -->
        <v-card class="mb-6 pa-4" elevation="3">
            <v-text-field v-model="newTitle" label="메모 제목" variant="underlined"></v-text-field>
            <v-textarea v-model="newContent" label="메모 내용 작성..." variant="underlined" rows="1" auto-grow></v-textarea>
            <div class="d-flex justify-end mt-2">
                <v-btn color="success" @click="addMemo">메모 저장</v-btn>
            </div>
        </v-card>

        <!-- 메모 목록 영역 -->
        <v-row>
            <v-col v-for="memo in memos" :key="memo.id" cols="12" md="6">
                <v-card class="h-100" elevation="2">
                    <v-card-title class="text-h6">{{ memo.title }}</v-card-title>
                    <v-card-subtitle class="mb-2">{{ memo.createdAt }}</v-card-subtitle>
                    <v-card-text class="text-body-1" style="white-space: pre-wrap;">{{ memo.content }}</v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="deleteMemo(memo.id)">삭제</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const memos = ref([])
const newTitle = ref('')
const newContent = ref('')

// 현재 로그인한 사람의 정보를 localStorage에서 가져오기
const currentUser = JSON.parse(localStorage.getItem('user'))

// 화면이 열리자마자 실행되는 함수
onMounted(() => {
    if (!currentUser) {
        alert('로그인이 필요합니다.')
        router.push('/') // 로그인 정보가 없으면 강제로 로그인 화면으로 이동
        return
    }
    fetchMemos()
})

// 메모 목록 불러오기 (GET 요청)
const fetchMemos = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/memos/user/${currentUser.id}`)
        
        console.log("백엔드 데이터", response.data) // 백엔드에서 받은 데이터 확인
        
        memos.value = response.data
    } catch (error) {
        console.error('메모를 불러오는데 실패했습니다.:', error)
    }
}

// 메모 저장하기 (POST 요청)
const addMemo = async () => {
    if (!newTitle.value || !newContent.value) {
        alert('제목과 내용을 모두 입력해주세요.')
        return
    }

    try {
        await axios.post('http://localhost:8080/api/memos', {
            userId: currentUser.id,
            title: newTitle.value,
            content: newContent.value
        })
        newTitle.value = ''
        newContent.value = ''
        fetchMemos() // 저장 후 메모 목록 갱신
    } catch (error) {
        console.error('메모 저장에 실패했습니다.:', error)
    }
}

// 메모 삭제하기 (DELETE 요청)
const deleteMemo = async (id) => {
    try {
        await axios.delete(`http://localhost:8080/api/memos/${id}`)
        fetchMemos() // 삭제 후 메모 목록 갱신
    } catch (error) {
        console.error('메모 삭제에 실패했습니다.:', error)
    }
}

// 로그아웃 처리
const logout = () => {
    localStorage.removeItem('user') // localStorage에서 사용자 정보 제거
    router.push('/') // 로그인 화면으로 이동
}
</script>
