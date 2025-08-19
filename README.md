# GitHub Repository Finder

[GitHub GraphQL API](https://docs.github.com/en/graphql)를 활용한 Repository 검색 웹 애플리케이션

## 프로젝트 실행 방법

### 1. 환경 설정

```bash
# 프로젝트 클론
git clone https://github.com/Yisuk/github-repo-finder.git
cd github-repo-finder

# 의존성 설치
yarn install
```

### 2. GitHub Personal Access Token 설정

1. GitHub에서 Personal Access Token(classic)을 생성합니다
2. 프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정합니다:

```bash
VITE_GITHUB_TOKEN=your_github_token_here
```

### 3. GraphQL 스키마 업데이트 및 Relay 컴파일

```bash
# GitHub GraphQL 스키마 다운로드 및 Relay 컴파일
yarn schema:update
```

### 4. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 5. 빌드

```bash
yarn build
```

## 기술 스택

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Icons
- Tanstack Virtual

### State Management & Data Fetching

- GraphQL
- React Relay
- React Context

### API

- GitHub GraphQL API v4

## 구현 기능들

### GitHub repository 검색

- **keyword 기반 검색**: 키워드를 통해 GitHub repository 검색
- **URL 쿼리 파라미터 지원**: 검색 결과 페이지를 URL로 공유 가능

### 검색된 repository 정보 제공

- **기본 정보**: Repository 이름, 설명, 소유자 정보
- **통계 정보**: 개발 언어, watcher 숫자, fork 숫자, star 숫자 및 마지막 업데이트 날짜

### Bookmark 관리

- **Bookmark 추가/제거**: 관심 있는 repository를 북마크로 저장
- **Bookmark 데이터 유지**: localStorage에 저장해 새로고침 시에도 정보 유지

### Repository star toggle

- **Star toggle**: Repository에 star를 추가/제거 가능
- **Check starred**: Repository에 star 여부 조회 및 실시간 반영

### Infinite scroll

- **Infinite scroll**: 검색 결과를 30개 단위로 조회. Scroll에 따라서 추가 데이터 로딩
- **Virtualized list**: `@tanstack/react-virtual`를 이용해 performance 최적화

## 프로젝트 내 도전 포인트

### GitHub GraphQL API 기반 pagination UI 선택

검색된 repository 숫자가 수만개 이상일 수 있기 때문에 전체 결과를 유저에게 전달하기 위해선 pagination이 필수적으로 구현되어야 합니다. GitHub GraphQL은 connection의 `PageInfo`에서 offset이 아닌 cursor만을 제공하기 때문에 infinite scroll UI를 구현 했습니다.

### Virtualized list 구현

query에 따라서 검색된 repository 숫자가 수만개 이상일 수 있기 때문에 repository component의 숫자가 증가해 렌더링 리소스가 증가하는 문제가 발생할 수 있습니다. 렌더링을 최적화 하기 위해서 Virtualized list를 적용했습니다. 라이브러리 적용을 용이하게 하기 위해 아래 3가지 기준으로 virtualized list를 지원하는 라이브러리들을 평가했습니다.

1. 라이브러리 업데이트가 꾸준히 이루어 지는지 여부
2. 필요한 기능을 구현하기 위한 코드 작성이 간단한지 여부
3. 필요한 정보를 찾기 위한 documentation이 존재하는지 여부

이 기준을 바탕으로 `@tanstack/react-virtual`을 선택하여 virtualized list를 구현했습니다.

### 검색된 GitHub repository UI 디자인

검색 결과를 보여주는 `RepositoryCard` UI에 어떤 정보들을 보여줄지 고민했습니다. 정보가 너무 많은 경우 유저가 시선이 분산되고, 필요한 정보를 찾기 어려운 문제가 발생합니다. 반대로 정보가 너무 적은 경우 원하는 정보를 얻기 위해서는 상세페이지로 이동해야 하는 문제가 발생합니다. GitHub는 개발자들이 주로 사용하는 서비스 이므로 가상의 유저에게 필요한 정보를 개발자 관점에서 선택했습니다.

watcher, fork, star의 개수는 respository가 보편적으로 사용되는지 여부를 평가할 수 있는 주요 통계입니다. 또한 마지막 업데이트 시점은 통해 유지 보수가 꾸준히 되고 있는지 확인할 수 있는 주요 데이터입니다. 이 데이터들은 프로젝트에서 사용할 새로운 패키지를 선택할 때 주로 참고하는 데이터 이기도 합니다. 따라서 `RepositoryCard` UI에서 repository의 이름, 설명과 같은 기본 정보와 함께 해당 데이터를 보여주도록 구현했습니다.
