# WeatherTago: 날씨 기반 지하철 혼잡도 예측 서비스

**기술 스택:**

- React Native
- Expo
- TypeScript

---

## 프로젝트 소개

웨더타고는 교통약자를 위한 기상 현황에 따른 지하철 혼잡도 예측 및 편의시설 제공 서비스입니다.
혼잡도 영향을 가장 많이 받는 교통약자를 대상으로 ‘교통약자를 위한 기상에 따른 지하철 혼잡도 예측 정보 및 편의시설 제공 서비스’라는 주제로 프로젝트를 진행하였습니다.

---

## 주요 기능

1. **로그인/회원가입**

   - 카카오톡 소셜 로그인 지원

2. **온보딩**

   - 첫 가입 시 앱 기능 간단 소개

3. **사전정보**

   - 즐겨찾는 역 다중 설정

4. **홈 화면**

   - 즐겨찾기 역 혼잡도 카드(기후에 따른 즐겨찾기 역 내

7. **마이페이지**
   - 로그아웃, 회원탈퇴


---

## 설치 및 실행

```bash
git clone https://github.com/WeatherTago/frontend.git
cd WeatherRoute
npm install
npx expo start
```

---

## 기여 방법

1. **이슈를 확인하고 작업할 항목 선택**
2. **브랜치 생성:**  
   `feat/기능명` 또는 `fix/버그명`
3. **작업 전 최신 dev 브랜치로부터 pull**
   ```bash
   git fetch origin
   git checkout dev
   git pull origin dev
   git checkout -b feat/기능명   # 또는 fix/버그명
   ```
4. **기능 개발**
5. **커밋 전 변경사항 확인**
   ```bash
   git status
   git diff
   ```
6. **변경사항 스테이징 및 커밋**
   ```bash
   git add .
   git commit -m "feat: 기능 추가 설명"
   ```
7. **PR 생성 전 dev 브랜치 최신 내용 반영**
   ```bash
   git fetch origin
   git rebase origin/dev
   ```
8. **PR(Pull Request) 생성**
9. **코드리뷰 후 병합**

---

## 커밋 컨벤션

- `feat`: 새로운 기능 개발
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅/오타/함수명 등 스타일 수정
- `build`: 빌드 관련 파일 수정
- `docs`: 문서 수정
- `chore`: 기타 자잘한 수정
- `ci`: CI 관련 설정 수정
- `test`: 테스트 코드 수정
- `design`: 디자인 관련 수정

**예시**

```markdown
feat: 로그인 기능 추가
fix: 역 검색 오류 수정
```

---

## 브랜치 전략

- `main`: 배포(프로덕션) 브랜치
- `dev`(develop): 통합 개발 브랜치 (기본 브랜치)
- `feature/기능명`: 기능 개발 브랜치 (`feat/`도 허용)
- `hotfix/이슈명`: 배포 중 긴급 버그 수정 브랜치

---

## Issue 작성 규칙

- **제목:** `[Feat|Fix|Refactor|Docs] 이슈 제목`
- **본문:** 아래 템플릿 활용

```
### 만들고자 하는 기능/수정사항
설명을 작성하세요.

### 세부 작업 목록
- [ ] 작업 1
- [ ] 작업 2

### 예상 작업 시간
ex) 2h
```

- **라벨, 담당자 지정 필수**
  - 라벨: 이슈 유형(예: feat, bug, urgent 등) 선택
  - 담당자: 실제 작업할 팀원 지정

---

## 기타

- Pull Request, Issue, 커밋, 브랜치명 등에 이슈 번호를 명시하면 추적이 용이합니다.
- 자세한 협업 규칙 및 코드 스타일 가이드는 추후 별도 문서로 안내될 수 있습니다.
- ### package.json 정렬
커밋 전 `package.json` 파일은 수동 정렬이 필요합니다.

```bash
npx sort-package-json

---

**문의 및 제안:**  
이슈 또는 PR로 남겨주세요.
