<template>
  <div class="email-container">
    <div class="email-layout">
      <!-- 좌측 탭 메뉴 -->
      <div class="email-sidebar">
        <button class="compose-btn" @click="changeTab('compose')">메일 쓰기</button>
        <ul class="tab-list">
          <li :class="{ active: currentTab === 'all' }" @click="changeTab('all')">전체 메일함</li>
          <li :class="{ active: currentTab === 'received' }" @click="changeTab('received')">받은 메일함</li>
          <li :class="{ active: currentTab === 'sent' }" @click="changeTab('sent')">보낸 메일함</li>
          <li :class="{ active: currentTab === 'important' }" @click="changeTab('important')">중요 메일함</li>
        </ul>
      </div>

      <!-- 우측 콘텐츠 영역 -->
      <div class="email-content">
        
        <!-- 1. 메일 쓰기 폼 (전문가형 레이아웃) -->
        <div v-if="currentTab === 'compose'" class="compose-section">
          
          <!-- 상단 툴바 -->
          <div class="compose-toolbar">
            <button class="btn-primary" @click="sendEmail">보내기</button>
            <button class="btn-secondary">미리보기</button>
            <button class="btn-secondary">임시저장</button>
          </div>

          <!-- 메일 헤더 (표 형태) -->
          <div class="compose-header">
            <div class="header-row">
              <div class="header-label">받는사람</div>
              <div class="header-input-wrapper">
                <input 
                  type="text" 
                  v-model="composeForm.receiverIds" 
                  placeholder="사번을 콤마(,)로 구분하여 입력 (예: 1, 2)" 
                  class="compose-input"
                />
                <button class="btn-outline">주소록</button>
              </div>
            </div>

            <div class="header-row">
              <div class="header-label">제목</div>
              <div class="header-input-wrapper">
                <input 
                  type="text" 
                  v-model="composeForm.title" 
                  placeholder="제목을 입력해 주세요" 
                  class="compose-input"
                />
                <label class="important-checkbox">
                  <input type="checkbox" v-model="composeForm.isImportant" />
                  <span class="star-icon">⭐ 중요</span>
                </label>
              </div>
            </div>

            <div class="header-row border-bottom-none">
              <div class="header-label">파일첨부</div>
              <div class="header-input-wrapper">
                <input type="file" @change="handleFileChange" class="compose-input file-input" />
              </div>
            </div>
          </div>

          <!-- 메일 본문 (에디터 영역) -->
          <div class="compose-body">
            <!-- 시각적인 에디터 툴바 (UI 데코레이션) -->
            <div class="editor-toolbar">
              <span class="editor-btn" style="font-weight: bold;">B</span>
              <span class="editor-btn" style="font-style: italic;">I</span>
              <span class="editor-btn" style="text-decoration: underline;">U</span>
              <span class="divider">|</span>
              <span class="editor-btn">가 ▾</span>
              <span class="editor-btn">10pt ▾</span>
            </div>
            <textarea 
              v-model="composeForm.content" 
              class="compose-textarea" 
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>
        </div>

        <!-- 2. 메일 목록 보기 -->
        <div v-else-if="!selectedEmail" class="list-section">
          <!-- 상단 툴바 추가 (삭제, 새로고침 등) -->
          <div class="list-toolbar">
            <h3 class="list-title">{{ changeTabName(currentTab) }}</h3>
            <div class="toolbar-actions">
              <button class="icon-btn" @click="currentTab === 'received' ? fetchReceivedEmails() : fetchSentEmails()" title="새로고침">🔄</button>
            </div>
          </div>
          
          <table class="email-table">
            <thead>
              <tr>
                <th width="5%" class="center-text">중요</th>
                <th width="15%">{{ currentTab === 'received' ? '보낸 사람' : '받는 사람' }}</th>
                <th width="55%">제목</th>
                <th width="5%" class="center-text">첨부</th>
                <th width="20%">날짜</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="email in emails" 
                :key="email.id" 
                @click="openEmail(email.id)"
                :class="{ 'unread': currentTab === 'received' && !email.read }"
              >
                <td class="center-text">
                  <span
                    class="star-toggle-btn"
                    @click.stop="toggleImportant(email)"
                  >
                    {{ email.important ? '⭐' : '☆' }}
                  </span>
                </td>
                <td>{{ currentTab === 'received' ? email.senderName : email.receiverName }}</td>
                <td class="email-title">{{ email.title }}</td>
                <td class="center-text">{{ email.fileName ? '📎' : '' }}</td>
                <td class="email-date">{{ formatDate(email.createdAt) }}</td>
              </tr>
              <tr v-if="emails.length === 0">
                <td colspan="5" class="empty-msg">메일함이 비어있습니다.</td>
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
            <h2>
              <span v-if="selectedEmail.important">⭐ </span>
              {{ selectedEmail.title }}
            </h2>
            <div class="info-row"><span class="label">보낸 사람:</span> {{ selectedEmail.senderId }}</div>
            <div class="info-row"><span class="label">받는 사람:</span> {{ selectedEmail.receiverId }}</div>
            <div class="info-row"><span class="label">날짜:</span> {{ formatDate(selectedEmail.createdAt) }}</div>
            
            <div v-if="selectedEmail.fileName" class="info-row attachment-row">
              <span class="label">첨부파일:</span> 
              <span class="file-badge">📎 {{ selectedEmail.fileName }}</span>
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

const currentTab = ref('received');
const emails = ref([]);
const selectedEmail = ref(null);

const composeForm = ref({
  receiverIds: '',
  title: '',
  content: '',
  isImportant: false,
  file: null
});

const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    composeForm.value.file = event.target.files[0];
  } else {
    composeForm.value.file = null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const changeTab = (tab) => {
  currentTab.value = tab;
  selectedEmail.value = null;
  if (tab === 'received') fetchReceivedEmails();
  else if (tab === 'sent') fetchSentEmails();
  else if (tab === 'important') fetchImportantEmails();
};

const changeTabName = (tabName) => {
  currentTab.value = tabName;
  if (tabName === 'all') return '전체 메일함';
  else if (tabName === 'received') return '받은 메일함';
  else if (tabName === 'sent') return '보낸 메일함';
  else if (tabName === 'important') return '중요 메일함';
};

const fetchAllEmails = async () => {
  try {
    const res = await api.get('/api/emails/all');
    emails.value = res.data;
  } catch (error) { alert('전체 메일함을 불러오지 못했습니다.'); }
};

const fetchReceivedEmails = async () => {
  try {
    const res = await api.get('/api/emails/received');
    emails.value = res.data;
  } catch (error) { alert('받은 메일함을 불러오지 못했습니다.'); }
};

const fetchSentEmails = async () => {
  try {
    const res = await api.get('/api/emails/sent');
    emails.value = res.data;
  } catch (error) { alert('보낸 메일함을 불러오지 못했습니다.'); }
};

const fetchImportantEmails = async () => {
  try {
    const res = await api.get('/api/emails/important');
    emails.value = res.data;
  } catch (error) { alert('중요 메일함을 불러오지 못했습니다.'); }
};

const toggleImportant = async (email) => {
  const originalState = email.important;
  email.important = !originalState;

  try {
    await api.put(`/api/emails/${email.id}/important`, {
      isImportant: email.important
    });

    if (currentTab.value === 'important' && !email.important) {
      fetchImportantEmails();
    }
  } catch (error) {
    email.important = originalState;
    alert('중요 표시 변경에 실패했습니다.');
  }
};

const openEmail = async (id) => {
  try {
    const res = await api.get(`/api/emails/${id}`);
    selectedEmail.value = res.data;
    if (currentTab.value === 'received') {
      const emailInList = emails.value.find(e => e.id === id);
      if (emailInList) emailInList.read = true;
    }
  } catch (error) { alert('메일 상세 정보를 불러오지 못했습니다.'); }
};

const sendEmail = async () => {
  if (!composeForm.value.receiverIds || !composeForm.value.title) {
    alert('받는 사람 사번과 제목을 입력해주세요.');
    return;
  }
  
  const idArray = composeForm.value.receiverIds.split(',').map(id => id.trim()).filter(id => id);
  const formData = new FormData();
  
  idArray.forEach(id => formData.append('receiverIds', id));
  formData.append('title', composeForm.value.title);
  formData.append('content', composeForm.value.content);
  formData.append('isImportant', composeForm.value.isImportant);
  
  if (composeForm.value.file) {
    formData.append('file', composeForm.value.file);
  }
  
  try {
    await api.post('/api/emails', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    alert('메일이 전송되었습니다!');
    composeForm.value = { receiverIds: '', title: '', content: '', isImportant: false, file: null };
    changeTab('sent');
  } catch (error) {
    alert('메일 전송에 실패했습니다.');
  }
};

const deleteEmail = async (id) => {
  if (!confirm('이 메일을 삭제하시겠습니까?')) return;
  try {
    await api.delete(`/api/emails/${id}`);
    alert('삭제되었습니다.');
    selectedEmail.value = null;
    if (currentTab.value === 'received') fetchReceivedEmails();
    else fetchSentEmails();
  } catch (error) { alert('삭제 중 오류가 발생했습니다.'); }
};

onMounted(() => {
  fetchReceivedEmails();
});
</script>

<style scoped>
/* 화면을 꽉 채우기 위한 100% 레이아웃 설정 */
.email-container { 
  height: 100%; 
  display: flex; 
  flex-direction: column; 
}

.email-layout { 
  display: flex; 
  flex: 1; /* 남은 높이 전체 차지 */
  background: var(--card-bg); 
  /* 기존에 있던 border-radius와 box-shadow, height 고정값 제거 */
  overflow: hidden; 
}

/* 좌측 사이드바 (메일함 목록) */
.email-sidebar { 
  width: 220px; /* 약간 슬림하게 조정 */
  min-width: 220px;
  background-color: var(--bg-main); 
  border-right: 1px solid var(--border-color); 
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
  border-radius: 8px; /* 버튼을 조금 더 둥글고 예쁘게 */
  font-weight: bold; 
  cursor: pointer; 
}
.compose-btn:hover { background-color: #004494; }

.tab-list { list-style: none; padding: 0; margin: 0; }
.tab-list li { 
  padding: 15px 25px; 
  cursor: pointer; 
  color: var(--text-muted); 
  font-weight: 500; 
}
.tab-list li:hover { background-color: var(--border-color); }
.tab-list li.active { 
  background-color: rgba(0, 86, 179, 0.1); 
  color: #0056b3; 
  border-left: 4px solid #0056b3; 
  font-weight: bold; 
}

/* 우측 콘텐츠 영역 (메일 내용 및 목록) */
.email-content { 
  flex: 1; 
  padding: 30px; 
  overflow-y: auto; 
  display: flex; 
  flex-direction: column; 
}

/* 별표 버튼에 마우스 올리면 살짝 커짐 */
.star-toggle-btn {
  cursor: pointer;
  font-size: 16px;
  display: inline-block;
  transition: transform 0.2s;
  user-select: none;
}

.star-toggle-btn:hover {
  transform: scale(1.3);
}

/* =========================================
   리스트 툴바 (받은/보낸 메일함 제목 영역)
========================================= */
.list-section { display: flex; flex-direction: column; height: 100%; }
.list-toolbar { 
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--border-color); 
  padding-bottom: 10px; margin-bottom: 15px; 
}
.list-title { margin: 0; color: var(--text-main); font-size: 20px; }
.toolbar-actions { display: flex; gap: 10px; }
.icon-btn { background: transparent; border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; cursor: pointer; color: var(--text-main); transition: 0.2s; }
.icon-btn:hover { background: var(--border-color); }

/* =========================================
   프로페셔널 메일 쓰기 레이아웃 
========================================= */
.compose-section { display: flex; flex-direction: column; height: 100%; }
.compose-toolbar { display: flex; gap: 10px; padding-bottom: 15px; border-bottom: 2px solid var(--text-main); margin-bottom: 20px; }
.btn-primary { padding: 8px 24px; background-color: #0056b3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
.btn-primary:hover { background-color: #004494; }
.btn-secondary { padding: 8px 16px; background-color: transparent; color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer; }
.btn-secondary:hover { background-color: var(--border-color); }
.btn-outline { padding: 0 12px; background-color: transparent; color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px; font-size: 13px; cursor: pointer; }

.compose-header { border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 20px; }
.header-row { display: flex; border-bottom: 1px solid var(--border-color); min-height: 45px; }
.border-bottom-none { border-bottom: none; }
.header-label { width: 120px; background-color: rgba(0, 0, 0, 0.02); display: flex; align-items: center; padding-left: 15px; font-size: 13px; font-weight: bold; color: var(--text-muted); border-right: 1px solid var(--border-color); }
[data-theme="dark"] .header-label { background-color: rgba(255, 255, 255, 0.02); }
.header-input-wrapper { flex: 1; display: flex; align-items: center; padding: 5px 10px; gap: 10px; }
.compose-input { flex: 1; border: none; background: transparent; color: var(--text-main); font-size: 14px; outline: none; padding: 5px; }
.important-checkbox { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 13px; color: var(--text-main); }
.star-icon { color: #f39c12; font-weight: bold; }

.compose-body { flex: 1; display: flex; flex-direction: column; border: 1px solid var(--border-color); border-radius: 4px; overflow: hidden; min-height: 400px; }
.editor-toolbar { display: flex; align-items: center; gap: 10px; padding: 8px 15px; background-color: rgba(0, 0, 0, 0.02); border-bottom: 1px solid var(--border-color); }
[data-theme="dark"] .editor-toolbar { background-color: rgba(255, 255, 255, 0.02); }
.editor-btn { font-size: 14px; color: var(--text-muted); cursor: pointer; padding: 4px 8px; border-radius: 4px; }
.editor-btn:hover { background-color: var(--border-color); color: var(--text-main); }
.divider { color: var(--border-color); }
.compose-textarea { flex: 1; border: none; resize: none; padding: 20px; font-size: 14px; line-height: 1.6; background-color: var(--input-bg); color: var(--text-main); outline: none; }

/* =========================================
   목록 및 상세 보기 스타일
========================================= */
.email-table { width: 100%; border-collapse: collapse; }
.email-table th, .email-table td { padding: 15px 10px; border-bottom: 1px solid var(--border-color); text-align: left; color: var(--text-main); }
.email-table th { background-color: var(--bg-main); font-weight: bold; font-size: 14px; }
.center-text { text-align: center !important; }
.email-title { font-weight: 500; }
.email-table tbody tr { cursor: pointer; }
.email-table tbody tr:hover { background-color: var(--bg-main); }
.email-table tbody tr.unread { font-weight: bold; background-color: rgba(0, 86, 179, 0.05); }

.email-date { color: var(--text-muted); font-size: 13px; }
.empty-msg { text-align: center; padding: 80px !important; color: var(--text-muted); }

.detail-header { display: flex; justify-content: space-between; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
.back-btn { background: none; border: none; color: #0056b3; cursor: pointer; font-weight: bold; font-size: 15px; display: flex; align-items: center; gap: 5px; }
.delete-btn { padding: 6px 16px; border: 1px solid #d32f2f; color: #d32f2f; background: transparent; border-radius: 4px; cursor: pointer; }
.delete-btn:hover { background-color: rgba(211, 47, 47, 0.05); }

.detail-info { background: var(--bg-main); padding: 25px; border-radius: 8px; margin-bottom: 20px; }
.detail-info h2 { margin-top: 0; margin-bottom: 20px; color: var(--text-main); }
.info-row { margin-bottom: 10px; color: var(--text-main); display: flex; align-items: center; }
.info-row .label { font-weight: bold; display: inline-block; width: 80px; color: var(--text-muted); }
.attachment-row { margin-top: 20px; padding-top: 20px; border-top: 1px dashed var(--border-color); }
.file-badge { display: inline-flex; align-items: center; gap: 5px; padding: 8px 12px; background-color: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 4px; font-size: 13px; font-weight: 500; }

.detail-body { padding: 20px; line-height: 1.8; color: var(--text-main); white-space: pre-wrap; font-size: 15px; border: 1px solid var(--border-color); border-radius: 8px; min-height: 400px; background-color: var(--card-bg); }
</style>