const DEFAULT_MENU=[
  {text:"회사소개",link:"#about"},
  {text:"서비스",link:"#service"},
  {text:"진행절차",link:"#process"},
  {text:"시공사례",link:"#portfolio"},
  {text:"문의",link:"#contact"}
];
const DEFAULT_SERVICES=[
  {title:"상가철거",desc:"상가, 매장, 카페, 식당 등 내부 철거를 안전하게 진행합니다."},
  {title:"사무실철거",desc:"집기, 칸막이, 천장, 바닥 철거까지 깔끔하게 정리합니다."},
  {title:"원상복구",desc:"임대차 종료 전 필요한 원상복구를 일정에 맞춰 진행합니다."},
  {title:"인테리어",desc:"철거 후 공간에 맞는 인테리어 마감까지 연결합니다."},
  {title:"폐기물 처리",desc:"현장 폐기물 반출과 정리를 책임지고 진행합니다."},
  {title:"현장 정리",desc:"공사 후 현장을 깨끗하게 정돈합니다."}
];

const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");
if(menuBtn){menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));}

function getData(key, fallback){return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));}
function onlyNumber(v){return (v||"").replace(/[^0-9]/g,"");}

function renderMenu(){
  const menu=getData("renovaMenu",DEFAULT_MENU);
  nav.innerHTML=menu.map(m=>`<a href="${m.link}">${m.text}</a>`).join("");
}
function renderSettings(){
  const s=getData("renovaSettings",{phone1:"010-8476-7456",phone2:"010-9169-7557",blog:"#",kakao:"#",brand:"RENOVA"});
  document.getElementById("brandName").textContent=s.brand||"RENOVA";
  document.getElementById("phone1").textContent=s.phone1||"010-8476-7456";
  document.getElementById("phone1").href="tel:"+onlyNumber(s.phone1||"01084767456");
  document.getElementById("phone2").textContent=s.phone2||"010-9169-7557";
  document.getElementById("phone2").href="tel:"+onlyNumber(s.phone2||"01091697557");
  document.getElementById("phoneBtn").href="tel:"+onlyNumber(s.phone1||"01084767456");
  document.getElementById("blogLink").href=s.blog||"#";
  document.getElementById("kakaoLink").href=s.kakao||"#";
}
function renderHero(){
  const h=getData("renovaHero",{small:"RENOVA ONBUILD · PREMIUM",title:"공간을 새롭게,<br>가치를 다시 만들다.",desc:"철거 · 원상복구 · 인테리어 · 폐기물 처리까지 현장에 맞는 정확한 견적과 깔끔한 마감으로 진행합니다.",image:""});
  document.getElementById("heroSmall").textContent=h.small;
  document.getElementById("heroTitle").innerHTML=h.title.replaceAll("\\n","<br>");
  document.getElementById("heroDesc").textContent=h.desc;
  if(h.image){document.getElementById("heroBg").style.backgroundImage=`url(${h.image})`;}
}
function renderAbout(){
  const a=getData("renovaAbout",{title:"현장을 아는 전문 시공 파트너",text:"리노바는 단순히 철거하는 업체가 아니라 다음 공간을 준비하는 전문 파트너입니다. 현장 확인부터 안전 작업, 폐기물 정리, 원상복구, 인테리어 마감까지 꼼꼼하게 진행합니다."});
  document.getElementById("aboutTitle").textContent=a.title;
  document.getElementById("aboutText").textContent=a.text;
}
function renderServices(){
  const services=getData("renovaServices",DEFAULT_SERVICES);
  document.getElementById("serviceGrid").innerHTML=services.map(s=>`<article><h3>${s.title}</h3><p>${s.desc}</p></article>`).join("");
}
function renderCases(){
  const box=document.getElementById("caseGallery");
  const cases=getData("renovaCases",[]);
  if(cases.length===0){
    box.innerHTML='<article class="caseCard"><div class="emptyImg">시공사례 이미지</div><h3>시공사례 준비중</h3><p>관리자에서 사진과 설명을 등록하면 이곳에 표시됩니다.</p></article>';
    return;
  }
  box.innerHTML=cases.map(item=>`
    <article class="caseCard">
      <div class="thumbs">${(item.images||[]).slice(0,10).map(src=>`<img src="${src}" onclick="openImage('${src}')">`).join("")}</div>
      <h3>${item.title}</h3><p>${item.desc||""}</p>
    </article>`).join("");
}
function openImage(src){
  let modal=document.querySelector(".modal");
  if(!modal){modal=document.createElement("div");modal.className="modal";modal.innerHTML="<img>";modal.onclick=()=>modal.classList.remove("show");document.body.appendChild(modal);}
  modal.querySelector("img").src=src;modal.classList.add("show");
}
renderMenu();renderSettings();renderHero();renderAbout();renderServices();renderCases();
