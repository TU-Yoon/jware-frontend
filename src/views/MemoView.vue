<template>
  <div class="memo-container">
    <div class="memo-layout">
      <!-- 좌측 탭 메뉴 영역 -->
      <div class="memo-sidebar">
        <button class="compose-btn" @click="changeTab('compose')">+ 메모 작성</button>
        <ul class="tab-list">
          <li :class="{ active: currentTab === 'all' }" @click="changeTab('all')">
            <span class="tab-icon">💡</span> 메모
          </li>
          <!-- 기능 미구현 탭 -->
          <li class="disabled-tab">
            <span class="tab-icon">🔔</span> 알림
          </li>
          <li class="disabled-tab">
            <span class="tab-icon">🏷️</span> 라벨 수정
          </li>
          <li class="disabled-tab">
            <span class="tab-icon">📦</span> 보관처리
          </li>
          <li class="disabled-tab">
            <span class="tab-icon">🗑️</span> 휴지통
          </li>
        </ul>
      </div>

      <!-- 우측 콘텐츠 영역 -->
      <div class="memo-content">

        <!-- 1. 메모 작성 화면 -->
        <div v-if="currentTab === 'compose'" class="compose-section">
          <div class="compose-card">
            <input
              type="text"
              v-model="newMemo.title"
              placeholder="제목"
              class="memo-input-title"
            />
            <textarea
              v-model="newMemo.content"
              placeholder="메모 작성..."
              class="memo-textarea"
            ></textarea>
            <div class="compose-actions">
              <button class="btn-cancel" @click="changeTab('all')">취소</button>
              <button class="btn-save" @click="saveMemo">저장</button>
            </div>
          </div>
        </div>

        <!-- 2. 메모 목록 화면 (Google Keep 스타일) -->
        <div v-else class="keep-grid-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apu from '../api/axios';
import api from '../api/axios';

const currentTab = ref('all');
const memos = ref([]);
const newMemo = ref({ title: '', content: '' });

// 탭 전환 함수
const changeTab = (tab) => {
  currentTab.value = tab;
  if (tab === 'all') {
    fetchMemos();
  }
};

// 메모 목록 조회
const fetchMemos = async () => {
  try {
    const res = await api.get('/api/memos');
    memos.value = res.data;
  } catch (error) {
    console.error('메모를 불러오지 못했습니다.', error);
  }
};

// 새 메모 저장
const saveMemo = async () => {
  if (!newMemo.value.content.trim() && !newMemo.value.title.trim()) {
    alert('내용을 입력해주세요.');
    return;
  }

  try {
    await api.post('/api/memos', newMemo.value);
    newMemo.value = { title: '', content: '' };
    changeTab('all') // 저장 후 목록으로 탭 이동
  } catch (error) {
    alert('메모 저장에 실패했습니다.');
  }
};

// 메모 삭제
const deleteMemo = async (id) => {
  if (!confirm('이 메모를 삭제하시겠습니까?')) return;
  try {
    await api.delete(`/api/memos/${id}`);
    fetchMemos();
  } catch (error) {
    alert('삭제 중 오류가 발생했습니다.');
  }
};

// 기존 메모 클릭시 로직 (현재는 상세 보기 말고 알림만)
const openMemo = (memo) => {
  // TODO: 메모 수정 팝업(모달) 띄우기 로직 추가 기능
  console.log('클릭된 메모: ', memo);
};

onMounted(() => {
  fetchMemos();
});
</script>

<style scoped>
</style>