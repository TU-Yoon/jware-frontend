<template>
  <!-- 화면 전체를 넓게 쓰기 위해 fluid 적용 -->
  <v-container fluid class="pa-0 h-100 bg-grey-lighten-4">
    <v-row no-gutters class="h-100">
      
      <!-- ⬅️ 왼쪽 사이드바 (폴더 메뉴) -->
      <v-col cols="12" sm="3" md="2" class="bg-white border-e h-100 pt-6 px-4" style="min-height: 80vh;">
        <div class="mb-6">
          <h2 class="text-h5 font-weight-black mb-2 text-primary" @click="router.push('/main')">Jworks Mail</h2>
          <span class="text-caption text-grey-darken-1">사번: {{ currentUser.id }}</span>
        </div>

        <!-- 새 메일 쓰기 버튼 (다이얼로그 연결) -->
        <v-dialog v-model="dialog" max-width="600">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" block size="large" v-bind="props" class="mb-6 font-weight-bold" elevation="2">
              <v-icon start>mdi-pencil</v-icon>
              메일 쓰기
            </v-btn>
          </template>
          <!-- (메일 쓰기 팝업 내용은 기존과 동일) -->
          <v-card>
            <v-card-title class="bg-primary text-white pa-4 font-weight-bold">새 메일 작성</v-card-title>
            <v-card-text class="pa-4 mt-2">
              <v-text-field v-model="newEmail.receiverId" label="받는 사람 (사번)" type="number" variant="outlined" class="mb-2"></v-text-field>
              <v-text-field v-model="newEmail.title" label="제목" variant="outlined" class="mb-2"></v-text-field>
              <v-textarea v-model="newEmail.content" label="내용" variant="outlined" rows="6"></v-textarea>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0 justify-end">
              <v-btn color="grey-darken-1" variant="text" @click="dialog = false">취소</v-btn>
              <v-btn color="success" variant="elevated" @click="sendEmail">보내기</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 폴더 리스트 -->
        <v-list nav class="pa-0">
          <v-list-item 
            value="received" 
            :active="currentFolder === 'received'"
            @click="changeFolder('received')"
            color="primary"
            rounded="lg"
            class="mb-1"
          >
            <template v-slot:prepend>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">받은 편지함</v-list-item-title>
            <!-- 안 읽은 메일 개수 뱃지 (옵션) -->
            <template v-slot:append>
              <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" inline></v-badge>
            </template>
          </v-list-item>

          <v-list-item 
            value="sent" 
            :active="currentFolder === 'sent'"
            @click="changeFolder('sent')"
            color="primary"
            rounded="lg"
          >
            <template v-slot:prepend>
              <v-icon>mdi-send</v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">보낸 편지함</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- ➡️ 오른쪽 메인 콘텐츠 영역 -->
      <v-col cols="12" sm="9" md="10" class="pa-6">
        
        <!-- 상태 1: 메일 리스트 화면 -->
        <v-card v-if="!selectedEmail" elevation="0" border rounded="lg" class="h-100 bg-white">
          <v-card-title class="d-flex align-center pa-4 border-b">
            <span class="text-h6 font-weight-bold">
              {{ currentFolder === 'received' ? '받은 편지함' : '보낸 편지함' }}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-refresh" variant="text" @click="fetchEmails"></v-btn>
          </v-card-title>

          <!-- 리스트형 게시판 스타일 -->
          <v-list lines="one" class="pa-0">
            <template v-for="(email, index) in currentEmailList" :key="email.id">
              <v-list-item 
                @click="viewEmail(email)"
                class="px-4 py-3 email-row"
                :class="{ 'bg-blue-grey-lighten-5': !email.read && currentFolder === 'received' }"
              >
                <div class="d-flex align-center w-100">
                  <!-- 읽음 상태 아이콘 -->
                  <v-icon 
                    v-if="currentFolder === 'received'" 
                    :color="!email.read ? 'primary' : 'grey-lighten-1'" 
                    class="mr-4"
                    size="small"
                  >
                    {{ !email.read ? 'mdi-email' : 'mdi-email-open-outline' }}
                  </v-icon>
                  <v-icon v-else color="grey-lighten-1" class="mr-4" size="small">mdi-email-send-outline</v-icon>

                  <!-- 발신자/수신자 -->
                  <div class="text-subtitle-2 mr-6" style="width: 100px;">
                    {{ currentFolder === 'received' ? `사번: ${email.senderId}` : `사번: ${email.receiverId}` }}
                  </div>
                  
                  <!-- 제목 -->
                  <div class="text-body-2 text-truncate flex-grow-1" :class="{ 'font-weight-bold': !email.read && currentFolder === 'received' }">
                    {{ email.title }}
                  </div>
                  
                  <!-- 날짜 -->
                  <div class="text-caption text-grey ms-4" style="width: 150px; text-align: right;">
                    {{ formatDate(email.sentAt) }}
                  </div>
                </div>
              </v-list-item>
              <v-divider v-if="index < currentEmailList.length - 1"></v-divider>
            </template>
            
            <!-- 비어있을 때 -->
            <div v-if="currentEmailList.length === 0" class="d-flex flex-column align-center justify-center py-12 text-grey">
              <v-icon size="64" class="mb-4 text-grey-lighten-2">mdi-inbox-outline</v-icon>
              <p>편지함이 비어있습니다.</p>
            </div>
          </v-list>
        </v-card>

        <!-- 상태 2: 메일 상세 보기 화면 -->
        <v-card v-else elevation="0" border rounded="lg" class="h-100 bg-white d-flex flex-column">
          <!-- 상단 툴바 -->
          <v-toolbar color="white" border="b" density="compact" elevation="0">
            <v-btn icon="mdi-arrow-left" variant="text" @click="selectedEmail = null"></v-btn>
            <v-toolbar-title class="text-body-1 ml-0">목록으로</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="deleteEmail(selectedEmail.id)">삭제</v-btn>
          </v-toolbar>

          <!-- 메일 헤더 -->
          <div class="pa-6 border-b bg-grey-lighten-5">
            <h2 class="text-h5 font-weight-bold mb-4">{{ selectedEmail.title }}</h2>
            <div class="d-flex align-center">
              <v-avatar color="primary" size="40" class="mr-4">
                <span class="text-white">{{ currentFolder === 'received' ? selectedEmail.senderId : selectedEmail.receiverId }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">
                  {{ currentFolder === 'received' ? `보낸 사람: 사번 ${selectedEmail.senderId}` : `받는 사람: 사번 ${selectedEmail.receiverId}` }}
                </div>
                <div class="text-caption text-grey">{{ formatDate(selectedEmail.sentAt) }}</div>
              </div>
            </div>
          </div>

          <!-- 메일 본문 -->
          <v-card-text class="pa-6 text-body-1 flex-grow-1" style="white-space: pre-wrap; line-height: 1.8;">
            {{ selectedEmail.content }}
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const currentUser = JSON.parse(localStorage.getItem('user'))

const dialog = ref(false)
const currentFolder = ref('received') // 'received' or 'sent'
const selectedEmail = ref(null) // null이면 리스트, 값이 있으면 상세화면 표시

const receivedEmails = ref([])
const sentEmails = ref([])

const newEmail = ref({
  receiverId: '',
  title: '',
  content: ''
})

// 현재 선택된 폴더에 맞는 배열을 반환하는 Computed 속성
const currentEmailList = computed(() => {
  return currentFolder.value === 'received' ? receivedEmails.value : sentEmails.value
})

// 안 읽은 메일 개수 계산
const unreadCount = computed(() => {
  return receivedEmails.value.filter(email => !email.read).length
})

onMounted(() => {
  if (!currentUser) {
    alert('로그인이 필요합니다.')
    router.push('/')
    return
  }
  fetchEmails()
})

const fetchEmails = async () => {
  try {
    const [receivedRes, sentRes] = await Promise.all([
      axios.get(`http://localhost:8080/api/emails/received/${currentUser.id}`),
      axios.get(`http://localhost:8080/api/emails/sent/${currentUser.id}`)
    ])
    receivedEmails.value = receivedRes.data
    sentEmails.value = sentRes.data
  } catch (error) {
    console.error('메일 목록을 불러오는데 실패했습니다:', error)
  }
}

const sendEmail = async () => {
  if (!newEmail.value.receiverId || !newEmail.value.title.trim()) {
    alert('받는 사람 번호와 제목을 입력해주세요.')
    return
  }
  
  try {
    await axios.post('http://localhost:8080/api/emails', {
      senderId: currentUser.id,
      receiverId: Number(newEmail.value.receiverId),
      title: newEmail.value.title,
      content: newEmail.value.content
    })
    
    newEmail.value = { receiverId: '', title: '', content: '' }
    dialog.value = false
    alert('메일을 성공적으로 보냈습니다!')
    
    fetchEmails() 
    currentFolder.value = 'sent' // 보내고 나면 보낸 편지함으로 자동 이동
    selectedEmail.value = null
  } catch (error) {
    console.error('메일 전송에 실패했습니다:', error)
  }
}

// 리스트에서 메일 클릭 시 실행되는 함수
const viewEmail = async (email) => {
  selectedEmail.value = email // 상세 화면으로 전환
  
  // 받은 편지함이고, 아직 안 읽은 메일이라면 읽음 처리 API 호출
  if (currentFolder.value === 'received' && !email.read) {
    try {
      await axios.put(`http://localhost:8080/api/emails/${email.id}/read`)
      email.read = true // 즉시 상태 업데이트
    } catch (error) {
      console.error('읽음 처리 실패:', error)
    }
  }
}

const deleteEmail = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  
  try {
    await axios.delete(`http://localhost:8080/api/emails/${id}`)
    selectedEmail.value = null // 삭제 후 리스트 화면으로 복귀
    fetchEmails() 
  } catch (error) {
    console.error('메일 삭제에 실패했습니다:', error)
  }
}

const changeFolder = (folderName) => {
  currentFolder.value = folderName
  selectedEmail.value = null // 폴더를 바꾸면 무조건 리스트 화면으로 돌아감
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  // 기업용 툴 스타일 날짜 포맷 (예: 2026-08-05 14:30)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
/* 마우스를 올렸을 때 클릭 가능한 느낌을 주는 효과 */
.email-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.email-row:hover {
  background-color: #f5f5f5;
}
</style>