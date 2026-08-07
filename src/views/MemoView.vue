<template>
  <div class="memo-container">
    <h2>📝 메모장</h2>
    
    <div class="memo-layout">
      <!-- 좌측: 메모 목록 영역 -->
      <div class="memo-list-section">
        <button class="new-memo-btn" @click="createNewMemo">
          + 새 메모 작성
        </button>
        
        <div class="memo-list">
          <div 
            v-for="memo in memos" 
            :key="memo.id" 
            class="memo-item"
            :class="{ active: selectedMemo?.id === memo.id }"
            @click="selectMemo(memo)"
          >
            <div class="memo-title">{{ memo.title }}</div>
            <div class="memo-date">{{ formatDate(memo.updatedAt) }}</div>
          </div>
          
          <div v-if="memos.length === 0" class="empty-list">
            작성된 메모가 없습니다.
          </div>
        </div>
      </div>

      <!-- 우측: 메모 에디터 영역 -->
      <div class="memo-editor-section" v-if="selectedMemo">
        <input 
          type="text" 
          v-model="selectedMemo.title" 
          placeholder="메모 제목을 입력하세요" 
          class="editor-title"
        />
        <textarea 
          v-model="selectedMemo.content" 
          placeholder="메모 내용을 자유롭게 작성해보세요" 
          class="editor-content"
        ></textarea>
        
        <div class="editor-actions">
          <!-- id가 있으면 기존 메모이므로 삭제 버튼 표시 -->
          <button v-if="selectedMemo.id" class="delete-btn" @click="deleteMemo(selectedMemo.id)">삭제</button>
          <div class="spacer"></div>
          <button class="save-btn" @click="saveMemo">저장</button>
        </div>
      </div>
      
      <!-- 우측: 선택된 메모가 없을 때 표시되는 빈 화면 -->
      <div class="memo-editor-empty" v-else>
        👈 왼쪽에서 메모를 선택하거나 새 메모를 작성해 보세요.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios'; // 인터셉터가 적용된 axios

const memos = ref([]);
const selectedMemo = ref(null);

// 날짜를 보기 좋게 변환하는 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 1. 메모 목록 불러오기 (GET)
const fetchMemos = async () => {
  try {
    const response = await api.get('/api/memos');
    memos.value = response.data;
  } catch (error) {
    console.error(error);
    alert('메모 목록을 불러오지 못했습니다.');
  }
};

// 2. 새 메모 작성 모드로 전환
const createNewMemo = () => {
  selectedMemo.value = {
    title: '',
    content: ''
  };
};

// 3. 메모 클릭 시 선택 처리
const selectMemo = (memo) => {
  // 깊은 복사를 통해 수정 중 취소(다른 메모 클릭) 시 원본 유지
  selectedMemo.value = { ...memo };
};

// 4. 메모 저장 (POST / PUT)
const saveMemo = async () => {
  if (!selectedMemo.value.title.trim()) {
    alert('메모 제목을 입력해주세요.');
    return;
  }
  
  try {
    if (selectedMemo.value.id) {
      // 기존 메모 수정 (PUT)
      await api.put(`/api/memos/${selectedMemo.value.id}`, selectedMemo.value);
    } else {
      // 새 메모 추가 (POST)
      await api.post('/api/memos', selectedMemo.value);
    }
    
    alert('저장되었습니다.');
    await fetchMemos(); // 목록 새로고침
    
    // 저장 후 목록에서 해당 메모를 다시 찾아서 선택 상태 유지
    const updated = memos.value.find(m => m.title === selectedMemo.value.title);
    if (updated) {
      selectedMemo.value = { ...updated };
    }
  } catch (error) {
    console.error(error);
    alert('저장 중 오류가 발생했습니다.');
  }
};

// 5. 메모 삭제 (DELETE)
const deleteMemo = async (id) => {
  if (!confirm('이 메모를 정말 삭제하시겠습니까?')) return;
  
  try {
    await api.delete(`/api/memos/${id}`);
    alert('삭제되었습니다.');
    selectedMemo.value = null; // 에디터 영역 초기화
    fetchMemos(); // 목록 새로고침
  } catch (error) {
    console.error(error);
    alert('삭제 중 오류가 발생했습니다.');
  }
};

// 컴포넌트 렌더링 시 최초 데이터 로드
onMounted(() => {
  fetchMemos();
});
</script>

<style scoped>
.memo-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h2 {
  color: #333;
  margin-bottom: 24px;
}

.memo-layout {
  display: flex;
  gap: 20px;
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  height: 600px; /* 적당한 높이 지정 */
}

/* 좌측 메모 목록 영역 */
.memo-list-section {
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.new-memo-btn {
  padding: 16px;
  background-color: #0056b3;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: background-color 0.2s;
}

.new-memo-btn:hover {
  background-color: #004494;
}

.memo-list {
  flex: 1;
  overflow-y: auto;
}

.memo-item {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.memo-item:hover {
  background-color: #f1f3f5;
}

.memo-item.active {
  background-color: #e3f2fd;
  border-left: 4px solid #0056b3;
}

.memo-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.memo-date {
  font-size: 12px;
  color: #888;
}

.empty-list {
  padding: 30px 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* 우측 메모 에디터 영역 */
.memo-editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.editor-title {
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 16px;
  outline: none;
  background-color: white;
  color: #333;
}

.editor-title:focus {
  border-bottom-color: #0056b3;
}

.editor-content {
  flex: 1;
  border: none;
  resize: none;
  font-size: 15px;
  line-height: 1.6;
  outline: none;
  background-color: white;
  color: #444;
}

.editor-actions {
  display: flex;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.spacer {
  flex: 1;
}

.save-btn, .delete-btn {
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}

.save-btn {
  background-color: #0056b3;
  color: white;
}
.save-btn:hover { background-color: #004494; }

.delete-btn {
  background-color: white;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}
.delete-btn:hover {
  background-color: #ffebee;
}

.memo-editor-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}
</style>