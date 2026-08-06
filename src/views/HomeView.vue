<template>
  <div class="home-container">
    <h2>📊 그룹웨어 대시보드</h2>
    <p>환영합니다! 로그인에 성공하셨습니다.</p>
    
    <div class="dashboard-cards">
      <div class="card">
        <h3>읽지 않은 이메일</h3>
        <p class="count">0 건</p>
      </div>
      <div class="card">
        <h3>오늘의 할 일</h3>
        <p class="count">0 건</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 향후 백엔드에서 사용자 정보나 요약 데이터를 불러오는 로직이 들어갈 자리입니다.
</script>

<style scoped>
.home-container {
  padding: 40px;
}

.home-container h2 {
  margin-bottom: 10px;
  color: #333;
}

.dashboard-cards {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  flex: 1;
  text-align: center;
}

.card h3 {
  margin-top: 0;
  color: #555;
  font-size: 16px;
}

.card .count {
  font-size: 24px;
  font-weight: bold;
  color: #0056b3;
  margin: 10px 0 0;
}
</style>