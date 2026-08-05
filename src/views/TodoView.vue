<!-- src/views/TodoView.vue -->
<template>
  <v-container max-width="800">
    <div class="d-flex justify-space-between align-center mb-6 mt-4">
      <h1 class="text-h4 font-weight-bold">할 일 목록</h1>
    </div>

    <!-- 할 일 추가 팝업(Dialog) 영역 -->
    <div class="mb-6 d-flex justify-end">
      <v-dialog v-model="dialog" max-width="500">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" size="large" v-bind="props" prepend-icon="mdi-plus">
            새로운 할 일 추가
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h6 font-weight-bold pa-4 bg-primary text-white">
            새 할 일 등록
          </v-card-title>
          <v-card-text class="pa-4 mt-2">
            <v-text-field 
              v-model="newTask.title" 
              label="할 일 제목" 
              variant="outlined" 
              class="mb-2"
            ></v-text-field>
            <v-text-field 
              v-model="newTask.deadline" 
              label="기한 (마감일)" 
              type="date" 
              variant="outlined"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0 justify-end">
            <v-btn color="grey-darken-1" variant="text" @click="dialog = false">취소</v-btn>
            <v-btn color="success" variant="elevated" @click="addTodo">저장하기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- 할 일 목록 출력 영역 -->
    <v-card elevation="2">
      <v-list lines="one">
        <v-list-item 
          v-for="task in tasks" 
          :key="task.id" 
          :class="{ 'bg-grey-lighten-4': task.completed }"
        >
          <template v-slot:prepend>
            <!-- 완료 상태 변경 체크박스 -->
            <v-checkbox-btn 
              v-model="task.completed" 
              color="primary"
              @change="updateTaskStatus(task)"
            ></v-checkbox-btn>
          </template>

          <!-- 🚨 v-list-item-title 로 수정완료 -->
          <v-list-item-title 
            :class="{ 'text-decoration-line-through text-grey': task.completed }"
            class="text-body-1 font-weight-medium"
          >
            {{ task.title }}
          </v-list-item-title>

          <template v-slot:append>
            <v-chip size="small" class="mr-4 text-grey">
              {{ task.deadline }} 까지
            </v-chip>
            <!-- 삭제 버튼 -->
            <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="deleteTask(task.id)"></v-btn>
          </template>
        </v-list-item>

        <v-list-item v-if="tasks.length === 0">
          <v-list-item-title class="text-center text-grey py-4">
            모든 할 일을 마쳤습니다! 🎉
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const tasks = ref([])

// 팝업 상태 및 새로운 할 일 데이터 객체
const dialog = ref(false)
const newTask = ref({
  title: '',
  deadline: ''
})

const currentUser = JSON.parse(localStorage.getItem('user'))

onMounted(() => {
  if (!currentUser) {
    alert('로그인이 필요합니다.')
    router.push('/')
    return
  }
  fetchTodos()
})

// 1. 목록 불러오기
const fetchTodos = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/todos/user/${currentUser.id}`)
    tasks.value = response.data
  } catch (error) {
    console.error('할 일 목록을 불러오는데 실패했습니다:', error)
  }
}

// 2. 새로운 할 일 추가
const addTodo = async () => {
  if (!newTask.value.title.trim()) {
    alert('할 일 제목을 입력해주세요.')
    return
  }
  try {
    await axios.post('http://localhost:8080/api/todos', {
      userId: currentUser.id,
      title: newTask.value.title,
      deadline: newTask.value.deadline || new Date().toISOString().split('T')[0],
      completed: false
    })
    
    newTask.value.title = ''
    newTask.value.deadline = ''
    dialog.value = false
    
    fetchTodos() // 저장 후 목록 갱신
  } catch (error) {
    console.error('할 일 추가에 실패했습니다:', error)
  }
}

// 3. 상태 변경 (체크박스)
const updateTaskStatus = async (task) => {
  try {
    await axios.put(`http://localhost:8080/api/todos/${task.id}`, {
      completed: task.completed
    })
  } catch (error) {
    console.error('상태 변경에 실패했습니다:', error)
    task.completed = !task.completed
  }
}

// 4. 할 일 삭제 (DB 연동 완비)
const deleteTask = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await axios.delete(`http://localhost:8080/api/todos/${id}`)
    fetchTodos() // 삭제 성공 시 목록 다시 불러오기
  } catch (error) {
    console.error('할 일 삭제에 실패했습니다:', error)
  }
}

const goBack = () => {
  router.push('/memo')
}
</script>