<template>
  <div class="email-container">
    <h2>📧 이메일</h2>
    
    <div class="email-layout">
      <!-- 좌측 탭 메뉴 -->
      <div class="email-sidebar">
        <button 
          class="compose-btn" 
          @click="changeTab('compose')"
        >
          메일 쓰기
        </button>
        <ul class="tab-list">
          <li 
            :class="{ active: currentTab === 'received' }" 
            @click="changeTab('received')"
          >
            받은 메일함
          </li>
          <li 
            :class="{ active: currentTab === 'sent' }" 
            @click="changeTab('sent')"
          >
            보낸 메일함
          </li>
        </ul>
      </div>

      <!-- 우측 콘텐츠 영역 -->
      <div class="email-content">
        
        <!-- 1. 메일 쓰기 폼 -->
        <div v-if="currentTab === 'compose'" class="compose-section">
          <h3>새 메일 작성</h3>
          <div class="form-group">
            <label>받는 사람 (사번 입력)</label>
            <input 
              type="number" 
              v-model="composeForm.receiverId" 
              placeholder="받는 사람의 사번(숫자)을 입력하세요" 
              class="white-input"
            />
          </div>
          <div class="form-group">
            <label>제목</label>
            <input 
              type="text" 
              v-model="composeForm.title" 
              placeholder="메일 제목을 입력하세요" 
              class="white-input"
            />
          </div>
          <div class="form-group">
            <label>내용</label>
            <textarea 
              v-model="composeForm.content" 
              placeholder="메일 내용을 작성하세요" 
              class="white-input content-textarea"
            ></textarea>
          </div>
          <div class="actions">
            <button class="send-btn" @click="sendEmail">보내기</button>
          </div>
        </div>

        <!-- 2. 메일 목록 보기 (받은/보낸 메일함) -->
        <div v-else-if="!selectedEmail" class="list-section">
          <h3 v-if="currentTab === 'received'">받은 메일함</h3>
          <h3 v-if="currentTab === 'sent'">보낸 메일함</h3>
          
          <table class="email-table">
            <thead>
              <tr>
                <th width="15%">
                  {{ currentTab === 'received' ? '보낸 사람(사번)' : '받는 사람(사번)' }}
                </th>
                <th width="60%">제목</th>
                <th width="25%">날짜</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="email in emails" 
                :key="email.id" 
                @click="openEmail(email.id)"
                :class="{ 'unread': currentTab === 'received' && !email.read }"
              >
                <td>{{ currentTab === 'received' ? email.senderName : email.receiverName }}</td>
                <td class="email-title">{{ email.title }}</td>
                <td class="email-date">{{ formatDate(email.createdAt) }}</td>
              </tr>
              <tr v-if="emails.length === 0">
                <td colspan="3" class="empty-msg">메일함이 비어있습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 3. 메일 상세 보기 -->
        <div v-else class="detail-section">
          <div class="detail-header">
            <button class="back-btn" @click="selectedEmail = null">⬅ 목록으로</button>
            <button class="delete-btn" @click="deleteEmail(selectedEmail.id)">삭제</button>
          </div>
          <div class="detail-info">
            <h2>{{ selectedEmail.title }}</h2>
            <div class="info-row">
              <span class="label">보낸 사람:</span> {{ selectedEmail.senderId }}
            </div>
            <div class="info-row">
              <span class="label">받는 사람:</span> {{ selectedEmail.receiverId }}
            </div>
            <div class="info-row">
              <span class="label">날짜:</span> {{ formatDate(selectedEmail.createdAt) }}
            </div>
          </div>
          <div class="detail-body">
            {{ selectedEmail.content }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

// 상태 관리
const currentTab = ref('received'); // 'received', 'sent', 'compose'
const emails = ref([]);
const selectedEmail = ref(null);

const composeForm = ref({
  receiverId: '',
  title: '',
  content: ''
});

// 날짜 포맷 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 탭 변경
const changeTab = (tab) => {
  currentTab.value = tab;
  selectedEmail.value = null; // 탭 이동 시 상세 보기 닫기
  if (tab === 'received') fetchReceivedEmails();
  else if (tab === 'sent') fetchSentEmails();
};

// 1. 받은 메일함 조회
const fetchReceivedEmails = async () => {
  try {
    const res = await api.get('/api/emails/received');
    emails.value = res.data;
  } catch (error) {
    alert('받은 메일함을 불러오지 못했습니다.');
  }
};

// 2. 보낸 메일함 조회
const fetchSentEmails = async () => {
  try {
    const res = await api.get('/api/emails/sent');
    emails.value = res.data;
  } catch (error) {
    alert('보낸 메일함을 불러오지 못했습니다.');
  }
};

// 3. 메일 상세 조회 (클릭 시)
const openEmail = async (id) => {
  try {
    const res = await api.get(`/api/emails/${id}`);
    selectedEmail.value = res.data;
    
    // 만약 받은 메일함에서 열었다면, 읽음 처리(isRead)가 되었을 테니 목록 데이터도 갱신해줍니다.
    if (currentTab.value === 'received') {
      const emailInList = emails.value.find(e => e.id === id);
      if (emailInList) emailInList.read = true;
    }
  } catch (error) {
    alert('메일 상세 정보를 불러오지 못했습니다.');
  }
};

// 4. 메일 전송
const sendEmail = async () => {
  if (!composeForm.value.receiverId || !composeForm.value.title) {
    alert('받는 사람 사번과 제목을 입력해주세요.');
    return;
  }
  
  try {
    await api.post('/api/emails', {
      receiverId: composeForm.value.receiverId,
      title: composeForm.value.title,
      content: composeForm.value.content
    });
    
    alert('메일이 전송되었습니다!');
    // 폼 초기화 후 보낸 메일함으로 이동
    composeForm.value = { receiverId: '', title: '', content: '' };
    changeTab('sent');
  } catch (error) {
    alert('메일 전송에 실패했습니다. (받는 사람 사번을 확인해주세요.)');
  }
};

// 5. 메일 삭제
const deleteEmail = async (id) => {
  if (!confirm('이 메일을 삭제하시겠습니까?')) return;
  
  try {
    await api.delete(`/api/emails/${id}`);
    alert('삭제되었습니다.');
    selectedEmail.value = null; // 상세 보기 닫기
    // 현재 탭 새로고침
    if (currentTab.value === 'received') fetchReceivedEmails();
    else fetchSentEmails();
  } catch (error) {
    alert('삭제 중 오류가 발생했습니다.');
  }
};

// 초기 렌더링 시 받은 메일함 로드
onMounted(() => {
  fetchReceivedEmails();
});
</script>

<style scoped>
.email-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

h2 { margin-bottom: 24px; color: #333; }
h3 { margin-bottom: 20px; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }

.email-layout {
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  height: 600px;
  overflow: hidden;
}

/* 좌측 사이드바 */
.email-sidebar {
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
}

.compose-btn {
  width: 80%;
  margin: 0 auto 20px;
  display: block;
  padding: 12px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.compose-btn:hover { background-color: #004494; }

.tab-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.tab-list li {
  padding: 15px 25px;
  cursor: pointer;
  color: #555;
  font-weight: 500;
}
.tab-list li:hover { background-color: #f1f3f5; }
.tab-list li.active {
  background-color: #e3f2fd;
  color: #0056b3;
  border-left: 4px solid #0056b3;
  font-weight: bold;
}

/* 우측 콘텐츠 영역 */
.email-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* 공통: 흰색 배경 강제 적용 (다크모드 간섭 방지) */
.white-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
  box-sizing: border-box;
  font-size: 14px;
}

/* 폼 요소 */
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-weight: bold; margin-bottom: 8px; color: #555; }
.content-textarea { height: 250px; resize: none; line-height: 1.5; }

.send-btn {
  padding: 12px 30px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.send-btn:hover { background-color: #004494; }

/* 테이블 (메일 목록) */
.email-table { width: 100%; border-collapse: collapse; }
.email-table th, .email-table td {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.email-table th { background-color: #fafafa; color: #666; font-weight: bold; }
.email-table tbody tr { cursor: pointer; }
.email-table tbody tr:hover { background-color: #f9f9f9; }
.email-table tbody tr.unread { font-weight: bold; background-color: #f0f7ff; }

.email-date { color: #888; font-size: 13px; }
.empty-msg { text-align: center; padding: 40px !important; color: #999; }

/* 메일 상세 보기 */
.detail-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.back-btn { background: none; border: none; color: #0056b3; cursor: pointer; font-weight: bold; font-size: 16px; }
.delete-btn { padding: 8px 16px; border: 1px solid #d32f2f; color: #d32f2f; background: white; border-radius: 4px; cursor: pointer; }
.delete-btn:hover { background: #ffebee; }

.detail-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.detail-info h2 { margin-top: 0; margin-bottom: 15px; }
.info-row { margin-bottom: 8px; color: #333; }
.info-row .label { font-weight: bold; display: inline-block; width: 80px; color: #666; }

.detail-body { padding: 20px 10px; line-height: 1.6; color: #444; white-space: pre-wrap; }
</style>