리노바 Firebase CMS 홈페이지

관리자 비밀번호
- 사용자가 요청한 초기 비밀번호: 3015
- 관리자 주소: /admin.html
- 관리자 로그인은 Firebase Authentication의 이메일/비밀번호 방식을 사용합니다.
- 최초 1회 admin.html에서 이메일을 입력하고 '최초 관리자 만들기'를 누르세요.

1. Firebase 프로젝트
프로젝트명: renova-cms

2. Firebase에서 켜야 하는 기능
① Authentication
- 빌드 > Authentication > 시작하기
- 로그인 방법 > 이메일/비밀번호 사용 설정

② Firestore Database
- 빌드 > Firestore Database > 데이터베이스 만들기
- 위치 선택 후 생성
- 이 압축파일의 firestore.rules 내용을 Firestore 규칙에 붙여넣고 게시

③ Storage
- 빌드 > Storage > 시작하기
- 이 압축파일의 storage.rules 내용을 Storage 규칙에 붙여넣고 게시

④ 웹 앱 등록
- 프로젝트 설정(톱니바퀴) > 일반 > 내 앱 > 웹 앱 </> 추가
- 앱 이름: renova-homepage
- 표시되는 firebaseConfig 값을 firebase-config.js에 입력

3. 관리자 기능
- 이메일 로그인 / 비밀번호 3015
- 오늘·어제·누적 방문자
- 메인 제목·설명·전화번호·카카오·블로그 수정
- 메인 이미지 파일 업로드
- 서비스 대표 이미지 파일 업로드
- 서비스별 상세 이미지 3컷 업로드와 제목·설명 수정
- 지역 추가·삭제
- 저장 즉시 모든 PC와 휴대폰에 공통 반영

4. 지역별 랜딩페이지 사용
한 개의 index.html에서 URL 파라미터로 지역을 표시합니다.
예:
- index.html?region=namyangju
- index.html?region=uijeongbu
- index.html?region=goyang

실제 도메인 연결 후 예:
https://도메인주소/?region=namyangju

5. 배포
전체 파일을 Vercel, Netlify, Firebase Hosting, 가비아 웹호스팅 등에 올리세요.
정적 파일만 올리면 되며, Firebase 데이터는 별도로 동작합니다.

6. 보안 주의
3015는 매우 짧은 비밀번호입니다. 최초 테스트 후 더 긴 비밀번호로 변경하는 것이 안전합니다.
Firebase Authentication에서 관리자 계정을 삭제하거나 비밀번호 재설정을 할 수 있습니다.


7. 가상 이미지
- 서비스 6개에 대표 이미지와 상세 이미지 3컷씩 샘플 이미지가 들어 있습니다.
- Firebase 연결 전에도 홈페이지에서 바로 보입니다.
- 관리자에서 실제 현장 사진으로 교체할 수 있습니다.
