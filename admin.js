import { firebaseConfig } from './firebase-config.js';
import { cloudinaryConfig } from './cloudinary-config.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
const cloudinaryConfigured = Boolean(
  cloudinaryConfig.cloudName &&
  cloudinaryConfig.uploadPreset &&
  !cloudinaryConfig.cloudName.includes('여기에_') &&
  !cloudinaryConfig.uploadPreset.includes('여기에_')
);

let app;
let auth;
let db;
let data;

const $ = (selector) => document.querySelector(selector);
const msg = (text) => { $('#loginMessage').textContent = text; };

async function defaults() {
  const response = await fetch('./default-data.json');
  if (!response.ok) throw new Error('기본 데이터 파일을 불러오지 못했습니다.');
  return response.json();
}

if (!firebaseConfigured) {
  msg('먼저 firebase-config.js에 Firebase 설정값을 입력하세요.');
  $('#setupBtn').disabled = true;
  $('#loginBtn').disabled = true;
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, (user) => user ? openAdmin() : showLogin());
}

$('#loginBtn').onclick = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      $('#loginEmail').value.trim(),
      $('#loginPassword').value
    );
    msg('');
  } catch (error) {
    msg('로그인 실패: ' + error.message);
  }
};

$('#setupBtn').onclick = async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      $('#loginEmail').value.trim(),
      $('#loginPassword').value
    );
    msg('관리자 계정을 만들었습니다.');
  } catch (error) {
    msg('생성 실패: ' + error.message);
  }
};

$('#logoutBtn').onclick = (event) => {
  event.preventDefault();
  signOut(auth);
};

function showLogin() {
  $('#loginView').classList.remove('hidden');
  $('#adminView').classList.add('hidden');
}

async function openAdmin() {
  $('#loginView').classList.add('hidden');
  $('#adminView').classList.remove('hidden');

  try {
    const snapshot = await getDoc(doc(db, 'cms', 'content'));
    data = snapshot.exists() ? snapshot.data() : await defaults();
    if (!snapshot.exists()) await setDoc(doc(db, 'cms', 'content'), data);

    fill();
    await loadStats();

    $('#connectionNote').className = cloudinaryConfigured ? 'success' : 'note';
    $('#connectionNote').textContent = cloudinaryConfigured
      ? 'Firebase 및 무료 이미지 업로드가 연결되었습니다.'
      : '텍스트 저장은 가능합니다. 이미지 업로드를 사용하려면 cloudinary-config.js 설정값을 입력하세요.';
  } catch (error) {
    alert('관리자 데이터를 불러오지 못했습니다: ' + error.message);
  }
}

async function loadStats() {
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const key = (date) => date.toISOString().slice(0, 10);

  try {
    const [todayDoc, yesterdayDoc, totalDoc] = await Promise.all([
      getDoc(doc(db, 'visits', key(today))),
      getDoc(doc(db, 'visits', key(yesterday))),
      getDoc(doc(db, 'stats', 'total'))
    ]);

    $('#todayStat').textContent = todayDoc.exists() ? todayDoc.data().count || 0 : 0;
    $('#yesterdayStat').textContent = yesterdayDoc.exists() ? yesterdayDoc.data().count || 0 : 0;
    $('#totalStat').textContent = totalDoc.exists() ? totalDoc.data().count || 0 : 0;
    $('#regionStat').textContent = data.regions.length;
  } catch (error) {
    console.warn('방문자 통계를 불러오지 못했습니다.', error);
  }
}

function fill() {
  for (const key of ['brand', 'headline', 'subheadline', 'phone1', 'phone2', 'kakao', 'blog', 'heroImage']) {
    $('#' + key).value = data.site[key] || '';
  }
  renderServices();
  renderRegions();
}

async function uploadImage(file, path) {
  if (!cloudinaryConfigured) {
    throw new Error('cloudinary-config.js에 Cloud name과 Unsigned upload preset을 입력하세요.');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('이미지는 10MB 이하만 업로드할 수 있습니다.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', `${cloudinaryConfig.folder}/${path}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinaryConfig.cloudName)}/image/upload`,
    { method: 'POST', body: formData }
  );

  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    throw new Error(result?.error?.message || '이미지 업로드에 실패했습니다.');
  }
  return result.secure_url;
}

async function withSaving(button, work) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = '저장 중...';
  try {
    await work();
  } catch (error) {
    alert('저장 실패: ' + error.message);
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

$('#saveSiteBtn').onclick = async () => withSaving($('#saveSiteBtn'), async () => {
  for (const key of ['brand', 'headline', 'subheadline', 'phone1', 'phone2', 'kakao', 'blog', 'heroImage']) {
    data.site[key] = $('#' + key).value.trim();
  }

  const heroFile = $('#heroUpload').files[0];
  if (heroFile) {
    data.site.heroImage = await uploadImage(heroFile, 'site');
  }

  await saveAll('기본 정보와 이미지를 저장했습니다.');
});

function renderServices() {
  $('#serviceEditors').innerHTML = data.services.map((service, index) => `
    <div class="service-editor" data-service="${index}">
      <h3>${index + 1}. ${esc(service.title)}</h3>
      <div class="form-grid">
        <div class="field"><label>서비스명</label><input data-key="title" value="${esc(service.title)}"></div>
        <div class="field"><label>대표 이미지</label><input data-key="cover" value="${esc(service.cover)}"></div>
        <div class="field"><label>대표 이미지 업로드</label><input data-cover-upload type="file" accept="image/*"></div>
        <div class="field" style="grid-column:1/-1"><label>설명</label><textarea data-key="desc">${esc(service.desc)}</textarea></div>
      </div>
      <h4>상세 이미지 3컷</h4>
      ${service.slides.map((slide, slideIndex) => `
        <div class="slide-editor" data-slide="${slideIndex}">
          <div class="form-grid">
            <div class="field"><label>${slideIndex + 1}컷 제목</label><input data-skey="title" value="${esc(slide.title)}"></div>
            <div class="field"><label>이미지 경로</label><input data-skey="image" value="${esc(slide.image)}"></div>
            <div class="field"><label>새 이미지 업로드</label><input data-slide-upload type="file" accept="image/*"></div>
            <div class="field"><label>설명</label><textarea data-skey="desc">${esc(slide.desc)}</textarea></div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

$('#saveServicesBtn').onclick = async () => withSaving($('#saveServicesBtn'), async () => {
  for (const box of document.querySelectorAll('[data-service]')) {
    const index = Number(box.dataset.service);
    const service = data.services[index];

    box.querySelectorAll('[data-key]').forEach((element) => {
      service[element.dataset.key] = element.value.trim();
    });

    const coverFile = box.querySelector('[data-cover-upload]').files[0];
    if (coverFile) {
      service.cover = await uploadImage(coverFile, `services/${service.id}/cover`);
    }

    for (const slideBox of box.querySelectorAll('[data-slide]')) {
      const slideIndex = Number(slideBox.dataset.slide);
      slideBox.querySelectorAll('[data-skey]').forEach((element) => {
        service.slides[slideIndex][element.dataset.skey] = element.value.trim();
      });

      const file = slideBox.querySelector('[data-slide-upload]').files[0];
      if (file) {
        service.slides[slideIndex].image = await uploadImage(
          file,
          `services/${service.id}/slide-${slideIndex + 1}`
        );
      }
    }
  }

  await saveAll('서비스와 상세 이미지를 저장했습니다.');
});

function renderRegions() {
  $('#regionEditors').innerHTML = data.regions.map((region, index) => `
    <div class="row" data-region="${index}" style="margin:10px 0">
      <input data-rkey="name" value="${esc(region.name)}">
      <input data-rkey="slug" value="${esc(region.slug)}">
      <button class="btn danger" data-delete-region="${index}">삭제</button>
    </div>
  `).join('');

  document.querySelectorAll('[data-delete-region]').forEach((button) => {
    button.onclick = () => {
      data.regions.splice(Number(button.dataset.deleteRegion), 1);
      renderRegions();
    };
  });
}

$('#addRegionBtn').onclick = () => {
  const name = $('#newRegionName').value.trim();
  const slug = $('#newRegionSlug').value.trim();
  if (!name || !slug) return alert('지역명과 영문 경로를 입력하세요.');

  data.regions.push({ name, slug });
  $('#newRegionName').value = '';
  $('#newRegionSlug').value = '';
  renderRegions();
};

$('#saveRegionsBtn').onclick = async () => withSaving($('#saveRegionsBtn'), async () => {
  document.querySelectorAll('[data-region]').forEach((box) => {
    const region = data.regions[Number(box.dataset.region)];
    box.querySelectorAll('[data-rkey]').forEach((element) => {
      region[element.dataset.rkey] = element.value.trim();
    });
  });
  await saveAll('지역 정보를 저장했습니다.');
});

async function saveAll(text) {
  await setDoc(doc(db, 'cms', 'content'), data);
  alert(text);
  fill();
  await loadStats();
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
