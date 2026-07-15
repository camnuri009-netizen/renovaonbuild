import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const configured=Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
let app,auth,db,storage,data;
const $=s=>document.querySelector(s);
const msg=t=>$('#loginMessage').textContent=t;

async function defaults(){return await fetch('./default-data.json').then(r=>r.json())}
if(!configured){
  msg('먼저 firebase-config.js에 Firebase 설정값을 입력하세요.');
  $('#setupBtn').disabled=true; $('#loginBtn').disabled=true;
}else{
  app=initializeApp(firebaseConfig); auth=getAuth(app); db=getFirestore(app); storage=getStorage(app);
  onAuthStateChanged(auth,user=>user?openAdmin():showLogin());
}
$('#loginBtn').onclick=async()=>{try{await signInWithEmailAndPassword(auth,$('#loginEmail').value.trim(),$('#loginPassword').value);msg('')}catch(e){msg('로그인 실패: '+e.message)}};
$('#setupBtn').onclick=async()=>{try{await createUserWithEmailAndPassword(auth,$('#loginEmail').value.trim(),$('#loginPassword').value);msg('관리자 계정을 만들었습니다.')}catch(e){msg('생성 실패: '+e.message)}};
$('#logoutBtn').onclick=e=>{e.preventDefault();signOut(auth)};
function showLogin(){$('#loginView').classList.remove('hidden');$('#adminView').classList.add('hidden')}
async function openAdmin(){
  $('#loginView').classList.add('hidden');$('#adminView').classList.remove('hidden');
  const d=await getDoc(doc(db,'cms','content')); data=d.exists()?d.data():await defaults();
  if(!d.exists()) await setDoc(doc(db,'cms','content'),data);
  fill(); await loadStats();
  $('#connectionNote').className='success';$('#connectionNote').textContent='Firebase 연결됨: 관리자 저장 내용이 모든 기기에서 동일하게 반영됩니다.';
}
async function loadStats(){
  const today=new Date(); const yesterday=new Date(Date.now()-86400000);
  const key=d=>d.toISOString().slice(0,10);
  const [t,y,total]=await Promise.all([getDoc(doc(db,'visits',key(today))),getDoc(doc(db,'visits',key(yesterday))),getDoc(doc(db,'stats','total'))]);
  $('#todayStat').textContent=t.exists()?t.data().count||0:0; $('#yesterdayStat').textContent=y.exists()?y.data().count||0:0; $('#totalStat').textContent=total.exists()?total.data().count||0:0; $('#regionStat').textContent=data.regions.length;
}
function fill(){
  for(const k of ['brand','headline','subheadline','phone1','phone2','kakao','blog','heroImage']) $('#'+k).value=data.site[k]||'';
  renderServices();renderRegions();
}
async function upload(file,path){const r=ref(storage,path);await uploadBytes(r,file);return await getDownloadURL(r)}
$('#saveSiteBtn').onclick=async()=>{
  for(const k of ['brand','headline','subheadline','phone1','phone2','kakao','blog','heroImage'])data.site[k]=$('#'+k).value.trim();
  if($('#heroUpload').files[0]) data.site.heroImage=await upload($('#heroUpload').files[0],`site/hero-${Date.now()}`);
  await saveAll('기본 정보를 저장했습니다.');
};
function renderServices(){
  $('#serviceEditors').innerHTML=data.services.map((s,i)=>`<div class="service-editor" data-service="${i}"><h3>${i+1}. ${s.title}</h3><div class="form-grid"><div class="field"><label>서비스명</label><input data-key="title" value="${esc(s.title)}"></div><div class="field"><label>대표 이미지</label><input data-key="cover" value="${esc(s.cover)}"></div><div class="field"><label>대표 이미지 업로드</label><input data-cover-upload type="file" accept="image/*"></div><div class="field" style="grid-column:1/-1"><label>설명</label><textarea data-key="desc">${esc(s.desc)}</textarea></div></div><h4>상세 이미지 3컷</h4>${s.slides.map((sl,j)=>`<div class="slide-editor" data-slide="${j}"><div class="form-grid"><div class="field"><label>${j+1}컷 제목</label><input data-skey="title" value="${esc(sl.title)}"></div><div class="field"><label>이미지 경로</label><input data-skey="image" value="${esc(sl.image)}"></div><div class="field"><label>새 이미지 업로드</label><input data-slide-upload type="file" accept="image/*"></div><div class="field"><label>설명</label><textarea data-skey="desc">${esc(sl.desc)}</textarea></div></div></div>`).join('')}</div>`).join('');
}
$('#saveServicesBtn').onclick=async()=>{
  for(const box of document.querySelectorAll('[data-service]')){
    const i=Number(box.dataset.service), s=data.services[i];
    box.querySelectorAll('[data-key]').forEach(el=>s[el.dataset.key]=el.value.trim());
    const coverFile=box.querySelector('[data-cover-upload]').files[0];
    if(coverFile)s.cover=await upload(coverFile,`services/${s.id}/cover-${Date.now()}`);
    for(const sb of box.querySelectorAll('[data-slide]')){
      const j=Number(sb.dataset.slide);sb.querySelectorAll('[data-skey]').forEach(el=>s.slides[j][el.dataset.skey]=el.value.trim());
      const f=sb.querySelector('[data-slide-upload]').files[0];
      if(f)s.slides[j].image=await upload(f,`services/${s.id}/slide-${j}-${Date.now()}`);
    }
  }
  await saveAll('서비스와 이미지 3컷을 저장했습니다.');
};
function renderRegions(){
  $('#regionEditors').innerHTML=data.regions.map((r,i)=>`<div class="row" data-region="${i}" style="margin:10px 0"><input data-rkey="name" value="${esc(r.name)}"><input data-rkey="slug" value="${esc(r.slug)}"><button class="btn danger" data-delete-region="${i}">삭제</button></div>`).join('');
  document.querySelectorAll('[data-delete-region]').forEach(b=>b.onclick=()=>{data.regions.splice(Number(b.dataset.deleteRegion),1);renderRegions()});
}
$('#addRegionBtn').onclick=()=>{const name=$('#newRegionName').value.trim(),slug=$('#newRegionSlug').value.trim();if(!name||!slug)return alert('지역명과 영문 경로를 입력하세요.');data.regions.push({name,slug});$('#newRegionName').value='';$('#newRegionSlug').value='';renderRegions()};
$('#saveRegionsBtn').onclick=async()=>{document.querySelectorAll('[data-region]').forEach(box=>{const r=data.regions[Number(box.dataset.region)];box.querySelectorAll('[data-rkey]').forEach(el=>r[el.dataset.rkey]=el.value.trim())});await saveAll('지역 정보를 저장했습니다.')};
async function saveAll(text){await setDoc(doc(db,'cms','content'),data);alert(text);fill();await loadStats()}
function esc(v=''){return String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
