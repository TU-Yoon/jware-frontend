<template>
  <div class="profile-container">
    <h2>👤 내 정보 (마이페이지)</h2>
    
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <!-- 프로필 이미지가 없다면 이름의 첫 글자를 보여주거나 기본 아이콘 표시 -->
          <span>윤</span> 
        </div>
        <div class="profile-title">
          <h3>윤태웅</h3>
          <p class="department">솔리데오시스템즈 중부지사 공공AX1팀</p>
        </div>
        <button class="edit-btn">정보 수정</button>
      </div>

      <div class="profile-body">
        <div class="info-group">
          <label>사번 (ID)</label>
          <div class="info-value">123456</div>
        </div>
        <div class="info-group">
          <label>이메일</label>
          <div class="info-value">taeung@jworks.com</div>
        </div>
        <div class="info-group">
          <label>비밀번호</label>
          <div class="info-value">
            ******** 
            <button class="pw-change-btn">변경</button>
          </div>
        </div>
        <div class="info-group">
          <label>입사일</label>
          <div class="info-value">2026-07-14</div>
        </div>
        <div class="info-group">
          <label>근무지</label>
          <div class="info-value">세종특별자치시 한누리대로 169</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 향후 백엔드에서 GET /api/users/me 등을 통해 
// 실제 로그인한 유저의 정보를 불러와 바인딩하면 됩니다.
</script>

<style scoped>
.profile-container {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: var(--text-main);
  margin-bottom: 30px;
}

.profile-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 30px;
  background-color: rgba(0, 86, 179, 0.03);
  border-bottom: 1px solid var(--border-color);
}
[data-theme="dark"] .profile-header { background-color: rgba(255,255,255,0.02); }

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #0056b3;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin-right: 20px;
}

.profile-title {
  flex: 1;
}

.profile-title h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: var(--text-main);
}

.department {
  margin: 0;
  color: var(--text-muted);
  font-size: 15px;
}

.edit-btn {
  padding: 8px 16px;
  background-color: transparent;
  color: #0056b3;
  border: 1px solid #0056b3;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}
.edit-btn:hover {
  background-color: #e3f2fd;
}

.profile-body {
  padding: 30px;
}

.info-group {
  margin-bottom: 25px;
}
.info-group:last-child {
  margin-bottom: 0;
}

.info-group label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  font-weight: bold;
}

.info-value {
  font-size: 16px;
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.pw-change-btn {
  padding: 4px 10px;
  background-color: var(--bg-main);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.pw-change-btn:hover {
  background-color: var(--border-color);
}
</style>