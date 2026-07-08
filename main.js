const DEFAULT_MENU=[{text:"회사소개",link:"#about"},{text:"서비스",link:"#service"},{text:"진행절차",link:"#process"},{text:"시공사례",link:"#portfolio"},{text:"문의",link:"#contact"}];
const DEFAULT_SERVICES=[{title:"상가철거",desc:"상가, 매장, 카페, 식당 등 내부 철거를 안전하게 진행합니다."},{title:"사무실철거",desc:"집기, 칸막이, 천장, 바닥 철거까지 깔끔하게 정리합니다."},{title:"원상복구",desc:"임대차 종료 전 필요한 원상복구를 일정에 맞춰 진행합니다."},{title:"인테리어",desc:"철거 후 공간에 맞는 인테리어 마감까지 연결합니다."},{title:"폐기물 처리",desc:"현장 폐기물 반출과 정리를 책임지고 진행합니다."},{title:"현장 정리",desc:"공사 후 현장을 깨끗하게 정돈합니다."}];
function getData(key,fallback){return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
function onlyNumber(v){return (v||"").replace(/[^0-9]/g,"");}
const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
if(menuBtn){menuBtn.onclick=()=>nav.classList.toggle("open");}
function renderMenu(){const menu=getData("renovaMenu",DEFAULT_MENU);nav.innerHTML=menu.map(m=>`<a href="${m.link}">${m.text}</a>`).join("");}
function renderSettings(){const s=getData("renovaSettings",{brand:"RENOVA",phone1:"010-8476-7456",phone2:"010-9169-7557",blog:"#",kakao:"#"});brandName.textContent=s.brand||"RENOVA";phone1.textContent=s.phone1;phone1.href="tel:"+onlyNumber(s.phone1);phone2.textContent=s.phone2;phone2.href="tel:"+onlyNumber(s.phone2);phoneBtn.href="tel:"+onlyNumber(s.phone1);blogLink.href=s.blog||"#";kakaoLink.href=s.kakao||"#";}
function renderHero(){const h=getData("renovaHero",{small:"RENOVA ONBUILD · PREMIUM",title:"공간을 새롭게,\\n가치를 다시 만들다.",desc:"철거 · 원상복구 · 인테리어 · 폐기물 처리까지 현장에 맞는 정확한 견적과 깔끔한 마감으로 진행합니다.",image:""});heroSmall.textContent=h.small;heroTitle.innerHTML=(h.title||"").replaceAll("\\n","<br>");heroDesc.textContent=h.desc||"";if(h.image){heroBg.style.backgroundImage=`url(${h.image})`;}}
function renderAbout(){
  const a=getData("renovaAbout",{title:"현장을 아는 전문 시공 파트너",text:"리노바는 단순히 철거하는 업체가 아니라 다음 공간을 준비하는 전문 파트너입니다.",images:[]});
  aboutTitle.textContent=a.title;
  aboutText.textContent=a.text;
  const items=(a.images||[]).slice(0,3).map(x=>typeof x==="string"?{src:x,desc:"",mt:0,mb:0,gap:24,w:320}:x);
  aboutImages.innerHTML=items.map((item,i)=>`
    <div class="aboutItem" style="margin-top:${item.mt||0}px;margin-bottom:${item.mb||0}px;grid-template-columns:${item.w||320}px 1fr;gap:${item.gap||24}px">
      <img src="${item.src}" alt="현장 이미지 ${i+1}">
      <p>${item.desc||""}</p>
    </div>
  `).join("");
}
function renderServices(){
  const list=getData("renovaServices",DEFAULT_SERVICES).map(x=>{
    return {
      ...x,
      mainImage:x.mainImage||"",
      detailImages:x.detailImages||[],
      detailDesc:x.detailDesc||x.desc,
      imgPos:x.imgPos||"left",
      detailPos:x.detailPos||"left",
      gap:x.gap||22,
      detailGap:x.detailGap||28
    };
  });
  serviceGrid.innerHTML=list.map((s,i)=>`
    <article>
      <div class="serviceCardInner ${s.imgPos==="right"?"right":""}" style="gap:${s.gap||22}px">
        ${s.mainImage ? `<img class="serviceImg" src="${s.mainImage}" onclick="openServiceDetail(${i})">` : ""}
        <div class="serviceText">
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <a class="serviceDetailBtn" href="javascript:void(0)" onclick="openServiceDetail(${i})">상세보기</a>
        </div>
      </div>
    </article>
  `).join("");
}
function openServiceDetail(i){
  const list=getData("renovaServices",DEFAULT_SERVICES);
  const s=list[i];
  let modal=document.querySelector(".serviceModal");
  if(!modal){
    modal=document.createElement("div");
    modal.className="serviceModal";
    document.body.appendChild(modal);
  }
  modal.innerHTML=`
    <div class="serviceModalBox">
      <button class="serviceModalClose" onclick="document.querySelector('.serviceModal').classList.remove('show')">닫기</button>
      <h2>${s.title}</h2>
      <div class="serviceDetailLayout ${s.detailPos==="right"?"right":""}" style="gap:${s.detailGap||28}px">
        <div class="detailImages">
          ${(s.detailImages||[]).map(img=>`<img src="${img}" onclick="openImage('${img}')">`).join("")}
        </div>
        <div class="detailText">
          <p>${s.detailDesc || s.desc || ""}</p>
        </div>
      </div>
    </div>
  `;
  modal.classList.add("show");
}
function renderCases(){const cases=getData("renovaCases",[]);if(!cases.length){caseGallery.innerHTML='<article class="caseCard"><div class="emptyImg">시공사례 이미지</div><h3>시공사례 준비중</h3><p>관리자에서 사진과 설명을 등록하면 표시됩니다.</p></article>';return;}caseGallery.innerHTML=cases.map(c=>`<article class="caseCard"><div class="thumbs">${(c.images||[]).slice(0,10).map(src=>`<img src="${src}" onclick="openImage('${src}')">`).join("")}</div><h3>${c.title}</h3><p>${c.desc||""}</p></article>`).join("");}
function openImage(src){let m=document.querySelector(".modal");if(!m){m=document.createElement("div");m.className="modal";m.innerHTML="<img>";m.onclick=()=>m.classList.remove("show");document.body.appendChild(m);}m.querySelector("img").src=src;m.classList.add("show");}
renderMenu();renderSettings();renderHero();renderAbout();renderServices();renderCases();