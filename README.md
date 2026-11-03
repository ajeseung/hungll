# Hungll 🍱

**LLM과 검색 기반 추천(RAG)을 결합한 음식점·메뉴 추천 서비스**

- 기간: 2025.03 ~ 2025.05
- 소속: SK Networks Family AI Camp 8기 팀 프로젝트
- 나의 역할: **백엔드 개발 및 인프라 구축 총괄**, RAG 연계, 서비스 성능 개선, 배포·운영
- 결과: **우수팀 선정**

## 1. 프로젝트 개요

사용자의 음식 종류, 가격대, 분위기 등 선호 조건을 입력받아 적합한 음식점과 메뉴를 추천하는 서비스입니다. Django 기반 일반 API와 FastAPI 기반 LLM 서버를 분리하고, 실제 음식점 데이터를 검색해 LLM에 제공하도록 구성했습니다.

## 2. 내가 해결한 주요 문제

### A. LLM의 환각 문제 → RAG 도입

**문제:** 초기에는 LLM이 실제 데이터에 없는 음식점 정보를 응답할 수 있었습니다.

**해결:** 음식점의 특성과 키워드를 임베딩한 뒤 FAISS 벡터 검색으로 사용자 질문과 관련된 후보를 먼저 조회하고, 검색 결과를 LLM에 전달했습니다.

**의의:** 모델이 외부 데이터에 근거해 추천하도록 구조를 개선했습니다. 정확도 향상 수치를 별도로 측정한 결과로 주장하지는 않습니다.

### B. 응답 지연 → Django·FastAPI 서버 분리

**문제:** 일반 API와 LLM 처리가 하나의 서버에 집중되며 응답 대기시간이 길어졌습니다.

**해결:** Django는 회원·게시판·식당 관련 API를 담당하고, FastAPI는 LLM 요청·응답 처리를 담당하도록 분리했습니다.

**성과:** 프로젝트에서 측정한 LLM 응답시간을 **약 8초에서 4초로 단축**했습니다.

### C. 수동 운영 부담 → CI/CD 및 알림 구축

**문제:** 배포 실패나 서비스 오류 발생 시 확인과 대응이 늦어질 수 있었습니다.

**해결:** Docker와 GitHub Actions를 활용한 배포 파이프라인을 구성하고, Slack 알림으로 배포 결과를 확인할 수 있도록 했습니다.

**성과:** 배포 문제의 평균 대응시간을 **약 30분에서 5분으로 단축**했습니다.

## 3. 내가 담당한 개발 범위

- **Backend:** Django REST API, 사용자 관리, 소셜 로그인, 게시판·댓글·찜 목록 등
- **AI integration:** OpenAI API 연동, FAISS 기반 RAG 검색·추천, 응답 구조 개선
- **Infrastructure:** AWS EC2·S3·CloudFront·API Gateway·Route53, Docker, GitHub Actions
- **Collaboration:** 프론트엔드 개발자와 API 명세·요구사항 조율, 일부 Nuxt 기능 구현
- **Operation:** 배포 오류, CORS, 파일 업로드, 캐시 및 CDN 관련 문제 해결

## 4. 서비스 구조

```text
사용자
  |
  v
Nuxt 프론트엔드 / Flutter 앱
  |
  +--------------------+
  |                    |
  v                    v
Django API         FastAPI AI 서버
회원·식당·찜 등      사용자 요청 처리
  |                    |
  v                    v
MySQL / Redis      FAISS 검색 → LLM 응답
  |
  v
AWS 기반 배포·정적 자산 제공
```

※ 개략적인 역할 분담을 나타낸 그림이며, 모든 서비스 간 네트워크 연결을 상세히 표현한 배포 다이어그램은 아닙니다.

## 5. 기술 스택

| 구분 | 기술 |
| --- | --- |
| Backend | Python, Django, FastAPI, MySQL, Redis |
| AI / Search | OpenAI API, LangChain, FAISS, RAG, LangSmith |
| Frontend / Mobile | Nuxt3, Flutter |
| Infrastructure | AWS EC2, S3, CloudFront, API Gateway, Route53, Docker |
| CI/CD | GitHub Actions, Slack 알림 |

## 6. 저장소 구조

```text
hungll/
├── django-backend/
├── fastapi-ai/snack/
├── nuxt-frontend/snack/
├── flutter-app/snack/
├── go-monitor/
├── docs/
└── README.md
```

기존 README의 예시 폴더명과 실제 저장소 경로가 달랐던 부분을 정리했습니다.

## 7. 프로젝트 성과

| 지표 | 결과 |
| --- | --- |
| LLM 응답시간 | 약 8초 → 4초 |
| 배포 문제 대응시간 | 약 30분 → 5분 |
| 실제 서비스 운영 | 활성 사용자 약 180명 확보 |
| 팀 성과 | SK Networks Family AI Camp 우수팀 |

*측정 환경과 지표의 정의를 추가로 정리하면 성과의 재현성과 신뢰도를 더 높일 수 있습니다.*

## 8. 다음 개선 과제

- RAG 추천 품질을 정량적으로 평가할 테스트셋과 지표 마련
- 오류·지연 관측성을 높이기 위한 모니터링 보강
- 개인정보 암호화 구현의 안전성 검토 및 운영 환경 보안 강화

> 이 저장소는 교육과정 팀 프로젝트 결과물입니다. 서비스 전체 기능은 팀 공동 작업이며, 위 '내가 담당한 개발 범위'에 개인 기여를 구분했습니다.
