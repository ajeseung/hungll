# 🍱 Hungll Monorepo

> **LLM 기반 맛집 추천 서비스**  
> AI + 백엔드 + 프론트 + 앱 + 모니터링을 모두 통합한 풀스택 프로젝트  
> 👉 **2025 AI 부트캠프 우수팀 선정 🏆**

---

## 🧩 프로젝트 구조

hungll/
├── backend-django/ # Django 기반 회원/선호도/식당 관리 API
├── backend-fastapi/ # FastAPI 기반 OpenAI LLM 응답 서버
├── frontend-nuxt/ # Nuxt.js 기반 검색 및 추천 UI
├── app-flutter/ # Flutter 기반 모바일 앱
├── monitor-go/ # Go 기반 모니터링 시스템
└── docs/award.pdf # 우수팀 상장 PDF


---

## 🏆 프로젝트 성과

- **AI 부트캠프 우수팀 선정**
- LLM + RAG + 사용자 선호도 기반 실시간 메뉴/식당 추천
- 실 유저 피드백 반영 추천 개선
- 프론트/앱/모니터링까지 통합된 실전 아키텍처 구현

📄 [👉 상장 보기 (PDF)](<./docs/SKN 8기 - 우수팀 상장.pdf>)

---

## 💡 주요 기능

- 사용자 입력(기분, 날씨 등) → LLM 기반 추천 응답
- 선호도에 따라 적합한 식당/메뉴 추출
- 클러스터링된 지도 기반 검색
- 즐겨찾기(찜), 히스토리, 감정 분석, RAG 검색 등 다양한 기능 내장

---

## 🧪 기술 스택

| 구분       | 스택/서비스 |
|------------|-------------|
| 백엔드     | Django, FastAPI, MySQL, Redis |
| AI 서버    | OpenAI API, Langchain, FAISS |
| 프론트엔드 | Nuxt.js, Kakao Maps API |
| 모바일 앱  | Flutter, Dart |
| DevOps     | AWS EC2/S3/CloudFront, GitHub Actions, Docker |
| 모니터링   | Go, (확장 예정: Grafana, Prometheus) |

---

## 🚀 실행 방법

### ✅ Django
```bash
cd backend-django/snack
python manage.py runserver 0.0.0.0:8000
```

### ✅ FastAPI
```bash
cd fastapi-ai/snack
python -m app.main
```

### ✅ Nuxt
```bash
cd nuxt-frontend/snack
npm install
npm run dev
```

### ✅ Flutter
```bash
cd flutter-app/snack
flutter run
```

### ✅ Go
```bash
cd go-monitor
go run main.go
```
