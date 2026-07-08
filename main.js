const DEFAULT_SERVICES=[
{title:"상가철거",desc:"상가, 매장, 카페, 식당 등 내부 철거",detailDesc:"상가철거 상세 설명",mainImage:"",detailImages:[]},
{title:"사무실철거",desc:"사무실 집기, 칸막이, 천장, 바닥 철거",detailDesc:"사무실철거 상세 설명",mainImage:"",detailImages:[]},
{title:"원상복구",desc:"임대차 종료 전 필요한 원상복구",detailDesc:"원상복구 상세 설명",mainImage:"",detailImages:[]},
{title:"인테리어",desc:"철거 후 인테리어 마감",detailDesc:"인테리어 상세 설명",mainImage:"",detailImages:[]},
{title:"폐기물처리",desc:"현장 폐기물 반출과 정리",detailDesc:"폐기물처리 상세 설명",mainImage:"",detailImages:[]},
{title:"현장정리",desc:"공사 후 현장 정리",detailDesc:"현장정리 상세 설명",mainImage:"",detailImages:[]}
];
function getData(k,f){return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}
function onlyNumber(v){return (v||"").replace(/[^0-9]/g,"")}
const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");if(menuBtn)menuBtn.onclick=()=>nav.classList.toggle("open");
function applySettings(){const s=getData("renovaSettings",{phone1:"010-8476-7456",phone2:"010-9169-7557",blog:"#",kakao:"#"});phone1.textContent=s.phone1;phone1.href="tel:"+onlyNumber(s.phone1);phone2.textContent=s.phone2;phone2.href="tel:"+onlyNumber(s.phone2);mainPhone.href="tel:"+onlyNumber(s.phone1);blogLink.href=s.blog||"#";kakaoLink.href=s.kakao||"#"}
function renderHero(){const h=getData("renovaHero",{image:""});if(h.image)heroBg.style.backgroundImage=`url(${h.image})`}
function renderAbout(){const a=getData("renovaAbout",{images:[]});aboutImages.innerHTML=(a.images||[]).slice(0,3).map(src=>`<img src="${src}" onclick="openImage('${src}')">`).join("")}
function renderServices(){const list=getData("renovaServices",DEFAULT_SERVICES);serviceGrid.innerHTML=list.map((s,i)=>`<article class="serviceCard">${s.mainImage?`<img src="${s.mainImage}" onclick="openService(${i})">`:`<div class="emptyImg">서비스 이미지</div>`}<h3>${s.title}</h3><p>${s.desc}</p><a class="detailBtn" href="javascript:void(0)" onclick="openService(${i})">상세보기</a></article>`).join("")}
function openService(i){const list=getData("renovaServices",DEFAULT_SERVICES),s=list[i];let m=document.querySelector(".modal");if(!m){m=document.createElement("div");m.className="modal";document.body.appendChild(m)}m.innerHTML=`<div class="modalBox"><button class="modalClose" onclick="document.querySelector('.modal').classList.remove('show')">닫기</button><h2>${s.title}</h2><p>${s.detailDesc||s.desc||""}</p><div class="detailImages">${(s.detailImages||[]).map(img=>`<img src="${img}" onclick="openImage('${img}')">`).join("")}</div></div>`;m.classList.add("show")}
function renderCases(){const cases=getData("renovaCases",[]);if(!cases.length){caseGallery.innerHTML='<article class="caseCard"><div class="emptyImg">시공사례 이미지</div><h3>시공사례 준비중</h3><p>관리자에서 등록하면 표시됩니다.</p></article>';return}caseGallery.innerHTML=cases.map(c=>`<article class="caseCard"><div class="caseImgs">${(c.images||[]).slice(0,10).map(img=>`<img src="${img}" onclick="openImage('${img}')">`).join("")}</div><h3>${c.title}</h3><p>${c.desc||""}</p></article>`).join("")}
function openImage(src){let m=document.querySelector(".modal");if(!m){m=document.createElement("div");m.className="modal";document.body.appendChild(m)}m.innerHTML=`<div class="modalBox"><button class="modalClose" onclick="document.querySelector('.modal').classList.remove('show')">닫기</button><img src="${src}" style="width:100%;max-height:80vh;object-fit:contain"></div>`;m.classList.add("show")}
applySettings();renderHero();renderAbout();renderServices();renderCases();