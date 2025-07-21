# 🚇 WeatherTago

웨더타고는 교통약자를 위한 기상 현황에 따른 지하철 혼잡도 예측 및 편의시설 제공 서비스입니다.
혼잡도 영향을 가장 많이 받는 교통약자를 대상으로 ‘교통약자를 위한 기상에 따른 지하철 혼잡도 예측 정보 및 편의시설 제공 서비스’라는 주제로 프로젝트를 진행하였습니다.

---

## 📱 주요 기능

### 🏠 메인 페이지  
- 즐겨찾기한 역들의 **날씨**와 **혼잡도 예측 정보** 표시  
- 하단 탭 네비게이션: 홈 / 알림 / 검색 / 편의시설 / 마이페이지

### 🔖 즐겨찾기 역 페이지  
- 자주 이용하는 지하철역을 즐겨찾기에 등록하여 빠르게 접근 가능  
- 즐겨찾기 설정 및 수정 기능 제공

### 📢 공지사항 페이지  
- 서울교통공사 실시간 공지사항 연동  
- 지하철 운행 정보, 장애 상황 등을 사용자에게 안내

### 📊 혼잡도 상세 페이지  
- 선택한 역의 **오늘 / 내일 / 모레** 3일간의 시간대별 혼잡도와 날씨 정보 제공

### 🛠 편의시설 정보  
- 노선 별로 **승강기 가동 현황**, **휠체어 리프트**, **무빙워크 위치** 등 교통약자를 위한 정보 제공

### 🔔 알림 설정 페이지  
- 사용자가 원하는 시간대, 방향, 기간에 맞춰 **혼잡도 알림 설정 가능**

---
<h3>📸 메인 화면</h3>
<p align="flex-start">
  <img src="https://github.com/user-attachments/assets/f6258c63-3b1b-4b15-afd1-888a2270caa3" width="200" />
  <img src="https://github.com/user-attachments/assets/8e75e03a-8395-43d7-8416-efe5a7b65210" width="200" />
  <img src="https://github.com/user-attachments/assets/04c88f86-6c04-4ed2-b62f-55ca185918bf" width="200" />
  <img src="https://github.com/user-attachments/assets/23d08a8d-32c0-4603-bf26-fbc76d4dc303" width="200" />
</p>

---

## ⚙️ 핵심 기술 스택

| 분류 | 기술 |
|------|------|
| 플랫폼 | React Native (Expo) |
| 언어 | TypeScript |
| 스타일링 | Emotion |
| 상태 관리 | Context API |
| 네비게이션 | Expo Router |
| API 통신 | Axios |
| 로컬 저장소 | AsyncStorage, SecureStore |
| 인증 | 카카오 로그인 (`@react-native-kakao/core`) |

---

## 🛠 개발 도구 및 환경

- 빌드/배포: **Expo EAS**
- 코드 포맷팅: **Prettier**
- 린팅: **ESLint**
- 테스트: **Jest**
- 푸시 알림: **expo-notifications**
- Firebase: **google-services.json 사용**

---

## 📁 프로젝트 폴더 구조
```bash
weathertago-front/
├── app/ # 페이지 및 라우팅
│ ├── (tabs)/ # 탭 네비게이션 화면들
│ │ ├── index.tsx # 홈 탭
│ │ ├── alert.tsx # 알림 탭
│ │ ├── information.tsx # 편의시설 탭
│ │ ├── mypage.tsx # 마이페이지 탭
│ │ └── congestion/ # 혼잡도 관련 화면들
│ └── onboarding/ # 온보딩 / 로그인 흐름
│
├── assets/ # 이미지 및 폰트 리소스
├── components/ # 재사용 가능한 UI 컴포넌트
├── constants/ # 공통 상수
├── context/ # 전역 상태 관리 (Context API)
├── hooks/ # 커스텀 훅
├── styles/ # 글로벌 스타일 및 테마
├── types/ # 타입 정의
├── utils/ # 유틸리티 함수
│
├── app.json # Expo 설정
├── eas.json # EAS 빌드 설정
├── package.json # 의존성 정보
├── tsconfig.json # TypeScript 설정
└── google-services.json # Firebase 연동 설정
```
---

### 📱 빌드
Android
```bash
npx expo run:android
```
EAS 빌드 (권장)
```bash
eas build --platform android
```
