import axios from 'axios';

// Axios 기본 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소
});

// 요청(Request) 인터셉터: 서버로 데이터를 보내기 전에 실행됨
api.interceptors.request.use(
  (config) => {
    // localStorage에서 저장된 토큰 가져오기
    const token = localStorage.getItem('token');
    
    // 토큰이 존재하면 헤더에 'Bearer 토큰' 형태로 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;