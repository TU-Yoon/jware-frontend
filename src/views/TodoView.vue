<template>
  <div class="todo-container">
    <h2>✅ 할 일 관리</h2>
    
    <!-- 할 일 추가 폼 -->
    <div class="add-todo-form">
      <input 
        type="text" 
        v-model="newTitle" 
        placeholder="새로운 할 일을 입력하세요" 
        @keyup.enter="addTodo"
        class="input-title"
      />
      <input 
        type="date" 
        v-model="newDeadline" 
        class="input-date"
      />
      <button @click="addTodo" class="add-btn">추가</button>
    </div>

    <!-- 할 일 목록 -->
    <div class="todo-list">
      <div 
        v-for="todo in todos" 
        :key="todo.id" 
        class="todo-item"
        :class="{ 'completed': todo.completed }"
      >
        <div class="todo-content">
          <!-- 완료 체크박스 -->
          <input 
            type="checkbox" 
            :checked="todo.completed" 
            @change="toggleComplete(todo)"
            class="checkbox"
          />
          
          <!-- 할 일 내용 -->
          <span class="title">{{ todo.title }}</span>
          
          <!-- 마감일 표시 (데이터가 있을 때만) -->
          <span class="deadline" v-if="todo.deadline">
            마감: {{ todo.deadline }}
          </span>
        </div>
        
        <!-- 삭제 버튼 -->
        <button @click="deleteTodo(todo.id)" class="delete-btn">삭제</button>
      </div>
      
      <!-- 목록이 비어있을 때 표시 -->
      <div v-if="todos.length === 0" class="empty-msg">
        등록된 할 일이 없습니다. 오늘 할 일을 추가해 보세요!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios'; // 토큰이 자동 주입되는 axios 인스턴스

const todos = ref([]);
const newTitle = ref('');
const newDeadline = ref('');

// 1. 할 일 목록 불러오기 (GET)
const fetchTodos = async () => {
  try {
    const response = await api.get('/api/todos');
    todos.value = response.data;
  } catch (error) {
    console.error(error);
    alert('할 일 목록을 불러오지 못했습니다.');
  }
};

// 2. 할 일 추가하기 (POST)
const addTodo = async () => {
  if (!newTitle.value.trim()) {
    alert('할 일 내용을 입력해주세요.');
    return;
  }
  try {
    await api.post('/api/todos', {
      title: newTitle.value,
      deadline: newDeadline.value || null // 날짜 지정 안 했으면 null 전송
    });
    // 추가 성공 후 입력창 초기화 및 목록 새로고침
    newTitle.value = '';
    newDeadline.value = '';
    fetchTodos(); 
  } catch (error) {
    alert('할 일 추가 중 오류가 발생했습니다.');
  }
};

// 3. 완료 상태 변경 (PUT)
const toggleComplete = async (todo) => {
  try {
    await api.put(`/api/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed // 현재 상태의 반대값으로 수정
    });
    fetchTodos(); // 성공 후 목록 새로고침 (정렬 순서 업데이트를 위함)
  } catch (error) {
    alert('상태 변경 중 오류가 발생했습니다.');
  }
};

// 4. 할 일 삭제 (DELETE)
const deleteTodo = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  
  try {
    await api.delete(`/api/todos/${id}`);
    fetchTodos(); // 삭제 성공 후 목록 새로고침
  } catch (error) {
    alert('삭제 중 오류가 발생했습니다.');
  }
};

// 화면이 처음 렌더링될 때 목록 불러오기 실행
onMounted(() => {
  fetchTodos();
});
</script>

<style scoped>
.todo-container {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 24px;
}

/* 추가 폼 스타일 */
.add-todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.input-title {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 15px;
}

.input-date {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}

.add-btn {
  padding: 0 24px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}
.add-btn:hover {
  background-color: #004494;
}

/* 목록 스타일 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.title {
  font-size: 16px;
  color: #333;
}

.deadline {
  font-size: 13px;
  color: #e53935;
  background-color: #ffebee;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: auto; /* 마감일을 오른쪽으로 밀어줌 */
  margin-right: 16px;
}

/* 완료된 항목 스타일 */
.todo-item.completed {
  opacity: 0.6;
  background-color: #f9f9f9;
}

.todo-item.completed .title {
  text-decoration: line-through;
  color: #888;
}

.todo-item.completed .deadline {
  color: #888;
  background-color: #eee;
}

/* 삭제 버튼 */
.delete-btn {
  padding: 8px 16px;
  background-color: #fff;
  color: #e53935;
  border: 1px solid #e53935;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.delete-btn:hover {
  background-color: #e53935;
  color: white;
}

.empty-msg {
  text-align: center;
  padding: 40px;
  color: #888;
  background: white;
  border-radius: 8px;
}
</style>