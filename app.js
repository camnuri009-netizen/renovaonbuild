import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, increment } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

let data, db=null, currentSlides=[], currentIndex=0;
const configured=Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

async function loadDefaults(){return await fetch('./default-data.json').then(r=>r.json())}
async function loadData(){
  const defaults=await loadDefaults();
  data=defaults;
  if(configured){
    try{
      const app=initializeApp(firebaseConfig); db=getFirestore(app);
      const snap=await getDoc(doc(db,'cms','content'));
      if(snap.exists()) data=snap.data();
      else await setDoc(doc(db,'cms','content'),defaults);
      await countVisit();
    }catch(e){console.warn('Firebase 연결 실패, 기본 데이터 사용',e)}
  }
  render();
}
async function countVisit(){
  if(!db)return;
  const day=new Date().toISOString().slice(0,10);
  if(sessionStorage.getItem('renova_visit_'+day))return;
  sessionStorage.setItem('renova_visit_'+day,'1');
  await setDoc(doc(db,'visits',day),{count:increment(1),updatedAt:new Date().toISOString()},{merge:true});
  await setDoc(doc(db,'stats','total'),{count:increment(1),updatedAt:new Date().toISOString()},{merge:true});
}
function qs(name){return new URLSearchParams(location.search).get(name)}
function render(){
  const selected=qs('region');
  const region=data.regions.find(r=>r.slug===selected);
  document.title=region?`${region.name} 철거 | 리노바 상가철거·원상복구 전문`:'리노바 | 지역별 철거·원상복구 전문';
  document.querySelector('#heroTitle').innerHTML=region?`${region.name} 철거 전문업체<br>${data.site.brand}`:`${data.site.headline}<br>${data.site.brand}`;
  document.querySelector('#regionTop').textContent=region?`${region.name} 전 지역 현장 방문견적`:'서울·경기 현장 방문견적';
  document.querySelector('#hero').style.backgroundImage=`url("${data.site.heroImage}")`;
  document.querySelectorAll('[data-site]').forEach(el=>el.textContent=data.site[el.dataset.site]||'');
  const tel=data.site.phone1.replaceAll('-','');
  document.querySelectorAll('.phone-link').forEach(a=>a.href=`tel:${tel}`);
  document.querySelector('#smsLink').href=`sms:${tel}`;
  document.querySelector('#kakaoLink').href=data.site.kakao; document.querySelector('#kakaoMobile').href=data.site.kakao;
  document.querySelector('#serviceGrid').innerHTML=data.services.map((s,i)=>`<article class="card" data-i="${i}"><img src="${s.cover}" alt="${s.title}"><div class="body"><h3>${s.title}</h3><p>${s.desc}</p><b>자세히 보기 →</b></div></article>`).join('');
  document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openService(Number(c.dataset.i)));
  document.querySelector('#regionGrid').innerHTML=data.regions.map(r=>`<a class="region" href="?region=${r.slug}">${r.name} 철거</a>`).join('');
}
function openService(i){const s=data.services[i];currentSlides=s.slides||[];currentIndex=0;document.querySelector('#modalTitle').textContent=s.title;showSlide();document.querySelector('#serviceModal').classList.add('open')}
function showSlide(){const s=currentSlides[currentIndex];document.querySelector('#slideImage').src=s.image;document.querySelector('#slideTitle').textContent=s.title;document.querySelector('#slideDesc').textContent=s.desc;document.querySelector('#counter').textContent=`${currentIndex+1} / ${currentSlides.length}`}
document.querySelector('#closeModal').onclick=()=>document.querySelector('#serviceModal').classList.remove('open');
document.querySelector('#prevSlide').onclick=()=>{currentIndex=(currentIndex-1+currentSlides.length)%currentSlides.length;showSlide()};
document.querySelector('#nextSlide').onclick=()=>{currentIndex=(currentIndex+1)%currentSlides.length;showSlide()};
document.querySelector('#serviceModal').onclick=e=>{if(e.target.id==='serviceModal')e.currentTarget.classList.remove('open')};
loadData();