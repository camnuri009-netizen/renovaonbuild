const ADMIN_PASSWORD="1234";
const DEFAULT_MENU=[{text:"회사소개",link:"#about"},{text:"서비스",link:"#service"},{text:"진행절차",link:"#process"},{text:"시공사례",link:"#portfolio"},{text:"문의",link:"#contact"}];
const DEFAULT_SERVICES=[{title:"상가철거",desc:"상가, 매장, 카페, 식당 등 내부 철거를 안전하게 진행합니다."},{title:"사무실철거",desc:"집기, 칸막이, 천장, 바닥 철거까지 깔끔하게 정리합니다."},{title:"원상복구",desc:"임대차 종료 전 필요한 원상복구를 일정에 맞춰 진행합니다."},{title:"인테리어",desc:"철거 후 공간에 맞는 인테리어 마감까지 연결합니다."},{title:"폐기물 처리",desc:"현장 폐기물 반출과 정리를 책임지고 진행합니다."},{title:"현장 정리",desc:"공사 후 현장을 깨끗하게 정돈합니다."}];
function getData(k,f){return JSON.parse(localStorage.getItem(k)||JSON.stringify(f));}
function setData(k,v){localStorage.setItem(k,JSON.stringify(v));}
function fileToData(file){return new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result);reader.readAsDataURL(file);});}
function openAdminImage(src){
  let box=document.querySelector(".adminLightbox");
  if(!box){
    box=document.createElement("div");
    box.className="adminLightbox";
    box.innerHTML="<img>";
    box.onclick=()=>box.classList.remove("show");
    document.body.appendChild(box);
  }
  box.querySelector("img").src=src;
  box.classList.add("show");
}
function login(){if(password.value===ADMIN_PASSWORD){localStorage.setItem("renovaAdmin","1");loginScreenOff();loadAll();}else alert("비밀번호가 다릅니다.");}
function loginScreenOff(){document.getElementById("login").style.display="none";document.getElementById("dash").style.display="block";}
function logout(){localStorage.removeItem("renovaAdmin");location.reload();}
function loadAll(){loadMenu();loadHero();loadAbout();loadServices();loadSettings();renderCases();}
function loadMenu(){const menu=getData("renovaMenu",DEFAULT_MENU);menuList.innerHTML=menu.map((m,i)=>`<div class="row"><input value="${m.text}" data-menu-text="${i}"><input value="${m.link}" data-menu-link="${i}"><button onclick="removeMenu(${i})">삭제</button></div>`).join("");}
function addMenu(){const m=getData("renovaMenu",DEFAULT_MENU);m.push({text:"새 메뉴",link:"#"});setData("renovaMenu",m);loadMenu();}
function removeMenu(i){const m=getData("renovaMenu",DEFAULT_MENU);m.splice(i,1);setData("renovaMenu",m);loadMenu();}
function saveMenu(){const rows=[...document.querySelectorAll("[data-menu-text]")];setData("renovaMenu",rows.map((el,i)=>({text:el.value,link:document.querySelector(`[data-menu-link="${i}"]`).value})));alert("메뉴 저장 완료");}
function loadHero(){const h=getData("renovaHero",{small:"RENOVA ONBUILD · PREMIUM",title:"공간을 새롭게,\\n가치를 다시 만들다.",desc:"철거 · 원상복구 · 인테리어 · 폐기물 처리까지 현장에 맞는 정확한 견적과 깔끔한 마감으로 진행합니다.",image:""});heroSmall.value=h.small;heroTitle.value=h.title;heroDesc.value=h.desc;}
async function saveHero(){const old=getData("renovaHero",{});let image=old.image||"";if(heroImage.files[0])image=await fileToData(heroImage.files[0]);setData("renovaHero",{small:heroSmall.value,title:heroTitle.value,desc:heroDesc.value,image});alert("배너 저장 완료");}
function loadAbout(){
  const a=getData("renovaAbout",{title:"현장을 아는 전문 시공 파트너",text:"리노바는 단순히 철거하는 업체가 아니라 다음 공간을 준비하는 전문 파트너입니다.",images:[]});
  aboutTitle.value=a.title;
  aboutText.value=a.text;
  const items=(a.images||[]).slice(0,3).map(x=>typeof x==="string"?{src:x,desc:"",mt:0,mb:0,gap:24,w:320}:{src:x.src,desc:x.desc||"",mt:x.mt||0,mb:x.mb||0,gap:x.gap||24,w:x.w||320});
  renderAboutPreview(items);
}
function getAboutItemsFromForm(){
  return [...document.querySelectorAll(".aboutEdit")].map((row,i)=>({
    src:row.querySelector("img").src,
    desc:row.querySelector(`[data-about-desc="${i}"]`).value,
    mt:Number(row.querySelector(`[data-about-mt="${i}"]`).value||0),
    mb:Number(row.querySelector(`[data-about-mb="${i}"]`).value||0),
    gap:Number(row.querySelector(`[data-about-gap="${i}"]`).value||24),
    w:Number(row.querySelector(`[data-about-w="${i}"]`).value||320)
  }));
}
function renderAboutPreview(items){
  aboutPreview.innerHTML=(items||[]).slice(0,3).map((item,i)=>`
    <div class="aboutEdit">
      <img src="${item.src}" onclick="openAdminImage(\`${item.src}\`)">
      <div>
        <textarea data-about-desc="${i}" placeholder="이미지 옆 설명글">${item.desc||""}</textarea>
        <div class="aboutControls">
          <input data-about-mt="${i}" type="number" value="${item.mt||0}" placeholder="위 여백 px">
          <input data-about-mb="${i}" type="number" value="${item.mb||0}" placeholder="아래 여백 px">
          <input data-about-gap="${i}" type="number" value="${item.gap||24}" placeholder="간격 px">
          <input data-about-w="${i}" type="number" value="${item.w||320}" placeholder="이미지 폭 px">
        </div>
        <button class="danger" onclick="removeAboutImage(${i})">이 이미지 삭제</button>
      </div>
    </div>
  `).join("");
}
async function saveAbout(){
  let images=getAboutItemsFromForm();
  const files=[...aboutImgs.files];
  if(files.length){
    const newImages=await Promise.all(files.map(fileToData));
    images=[...images,...newImages.map(src=>({src,desc:"",mt:0,mb:0,gap:24,w:320}))].slice(0,3);
  }
  setData("renovaAbout",{title:aboutTitle.value,text:aboutText.value,images});
  aboutImgs.value="";
  renderAboutPreview(images);
  alert("회사소개 저장 완료");
}
function removeAboutImage(i){
  const images=getAboutItemsFromForm();
  images.splice(i,1);
  setData("renovaAbout",{title:aboutTitle.value,text:aboutText.value,images});
  renderAboutPreview(images);
}
function clearAboutImages(){
  setData("renovaAbout",{title:aboutTitle.value,text:aboutText.value,images:[]});
  renderAboutPreview([]);
  alert("회사소개 이미지가 삭제되었습니다.");
}
function normalizeService(x){
  return {
    title:x.title||"",
    desc:x.desc||"",
    mainImage:x.mainImage||"",
    detailDesc:x.detailDesc||x.desc||"",
    detailImages:x.detailImages||[],
    imgPos:x.imgPos||"left",
    detailPos:x.detailPos||"left",
    gap:Number(x.gap||22),
    detailGap:Number(x.detailGap||28)
  };
}
function loadServices(){
  const services=getData("renovaServices",DEFAULT_SERVICES).map(normalizeService);
  serviceList.innerHTML=services.map((x,i)=>`
    <div class="serviceEditBox">
      <input value="${x.title}" data-service-title="${i}" placeholder="서비스 제목">
      <textarea data-service-desc="${i}" placeholder="서비스 카드 설명">${x.desc}</textarea>
      <textarea data-service-detail="${i}" placeholder="상세보기 설명">${x.detailDesc||""}</textarea>

      <div class="layoutControls">
        <label>카드 이미지 위치
          <select data-service-pos="${i}">
            <option value="left" ${x.imgPos==="left"?"selected":""}>왼쪽</option>
            <option value="right" ${x.imgPos==="right"?"selected":""}>오른쪽</option>
          </select>
        </label>
        <label>카드 이미지/글 간격
          <input type="range" min="0" max="80" value="${x.gap}" data-service-gap="${i}" oninput="this.nextElementSibling.textContent=this.value+'px'">
          <span>${x.gap}px</span>
        </label>
        <label>상세 이미지 위치
          <select data-detail-pos="${i}">
            <option value="left" ${x.detailPos==="left"?"selected":""}>왼쪽</option>
            <option value="right" ${x.detailPos==="right"?"selected":""}>오른쪽</option>
          </select>
        </label>
      </div>

      <div class="layoutControls">
        <label>상세 이미지/글 간격
          <input type="range" min="0" max="100" value="${x.detailGap}" data-detail-gap="${i}" oninput="this.nextElementSibling.textContent=this.value+'px'">
          <span>${x.detailGap}px</span>
        </label>
      </div>

      <p class="sub">서비스 카드 메인 이미지</p>
      ${x.mainImage ? `<div class="serviceEditImages"><img src="${x.mainImage}" onclick="openAdminImage(\`${x.mainImage}\`)"></div>` : ""}
      <input type="file" accept="image/*" onchange="changeServiceMainImage(${i},this)">

      <p class="sub">상세보기 하위 이미지 추가/삭제</p>
      <div class="serviceEditImages">
        ${(x.detailImages||[]).map((img,j)=>`<div class="imgBox"><img src="${img}" onclick="openAdminImage(\`${img}\`)"><button onclick="removeServiceDetailImage(${i},${j})">X</button></div>`).join("")}
      </div>
      <input type="file" accept="image/*" multiple onchange="addServiceDetailImages(${i},this)">

      <button onclick="moveService(${i},-1)">왼쪽으로</button>
      <button onclick="moveService(${i},1)">오른쪽으로</button>
      <button class="danger" onclick="removeService(${i})">서비스 삭제</button>
    </div>
  `).join("");
  renderServiceAdminPreview();
}
function renderServiceAdminPreview(){
  const box=document.getElementById("serviceAdminPreview");
  if(!box)return;
  const services=readServicesFromForm();
  box.innerHTML=services.map((s,i)=>`
    <div class="adminPreviewCard">
      ${s.mainImage ? `<img src="${s.mainImage}" onclick="openAdminImage(\`${s.mainImage}\`)">` : `<div class="empty">이미지 없음</div>`}
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <div class="adminPreviewImages">
        ${(s.detailImages||[]).slice(0,4).map(img=>`<img src="${img}" onclick="openAdminImage(\`${img}\`)">`).join("")}
      </div>
    </div>
  `).join("");
}
function readServicesFromForm(){
  const old=getData("renovaServices",DEFAULT_SERVICES).map(normalizeService);
  return [...document.querySelectorAll("[data-service-title]")].map((el,i)=>({
    title:el.value,
    desc:document.querySelector(`[data-service-desc="${i}"]`).value,
    detailDesc:document.querySelector(`[data-service-detail="${i}"]`).value,
    mainImage:old[i]?.mainImage||"",
    detailImages:old[i]?.detailImages||[],
    imgPos:document.querySelector(`[data-service-pos="${i}"]`).value,
    detailPos:document.querySelector(`[data-detail-pos="${i}"]`).value,
    gap:Number(document.querySelector(`[data-service-gap="${i}"]`).value||22),
    detailGap:Number(document.querySelector(`[data-detail-gap="${i}"]`).value||28)
  }));
}
function addService(){
  const s=readServicesFromForm();
  s.push({title:"새 서비스",desc:"서비스 설명",detailDesc:"상세 설명",mainImage:"",detailImages:[],imgPos:"left",detailPos:"left",gap:22,detailGap:28});
  setData("renovaServices",s);
  loadServices();
}
function removeService(i){
  const s=readServicesFromForm();
  s.splice(i,1);
  setData("renovaServices",s);
  loadServices();
}
function moveService(i,dir){
  const s=readServicesFromForm();
  const ni=i+dir;
  if(ni<0||ni>=s.length)return;
  [s[i],s[ni]]=[s[ni],s[i]];
  setData("renovaServices",s);
  loadServices();
}
function saveServices(){
  setData("renovaServices",readServicesFromForm());
  alert("서비스 저장 완료");
renderServiceAdminPreview();
}
async function changeServiceMainImage(i,input){
  const s=readServicesFromForm();
  if(input.files[0]){
    s[i].mainImage=await fileToData(input.files[0]);
    setData("renovaServices",s);
    loadServices();
  }
}
async function addServiceDetailImages(i,input){
  const s=readServicesFromForm();
  const imgs=await Promise.all([...input.files].map(fileToData));
  s[i].detailImages=[...(s[i].detailImages||[]),...imgs];
  setData("renovaServices",s);
  loadServices();
}
function removeServiceDetailImage(i,j){
  const s=readServicesFromForm();
  s[i].detailImages.splice(j,1);
  setData("renovaServices",s);
  loadServices();
}
function loadSettings(){const s=getData("renovaSettings",{brand:"RENOVA",phone1:"010-8476-7456",phone2:"010-9169-7557",blog:"",kakao:""});brand.value=s.brand;phone1.value=s.phone1;phone2.value=s.phone2;blog.value=s.blog;kakao.value=s.kakao;}
function saveSettings(){setData("renovaSettings",{brand:brand.value,phone1:phone1.value,phone2:phone2.value,blog:blog.value,kakao:kakao.value});alert("기본 정보 저장 완료");}
function getCases(){return getData("renovaCases",[]);}
function saveCases(c){setData("renovaCases",c);}
async function saveCase(){const title=caseTitle.value.trim(),desc=caseDesc.value.trim();if(!title){alert("제목을 입력해주세요.");return;}const images=await Promise.all([...caseImages.files].slice(0,10).map(fileToData));const cases=getCases();cases.unshift({id:Date.now(),title,desc,images});saveCases(cases);caseTitle.value="";caseDesc.value="";caseImages.value="";renderCases();alert("시공사례 저장 완료");}
function deleteCase(id){if(confirm("삭제하시겠습니까?")){saveCases(getCases().filter(x=>x.id!==id));renderCases();}}
function editCase(id){const cases=getCases();const c=cases.find(x=>x.id===id);const t=prompt("제목 수정",c.title);if(t===null)return;const d=prompt("설명 수정",c.desc||"");c.title=t;c.desc=d||"";saveCases(cases);renderCases();}
async function addImagesToCase(id,input){const imgs=await Promise.all([...input.files].slice(0,10).map(fileToData));const cases=getCases();const c=cases.find(x=>x.id===id);c.images=[...(c.images||[]),...imgs].slice(0,10);saveCases(cases);renderCases();}
function removeImage(id,i){const cases=getCases();const c=cases.find(x=>x.id===id);c.images.splice(i,1);saveCases(cases);renderCases();}
function renderCases(){const cases=getCases();if(!cases.length){caseList.innerHTML="<p>등록된 시공사례가 없습니다.</p>";return;}caseList.innerHTML=cases.map(c=>`<div class="caseItem"><h3>${c.title}</h3><p>${c.desc||""}</p><div class="caseImages">${(c.images||[]).map((img,i)=>`<div class="imgBox"><img src="${img}" onclick="openAdminImage(\`${img}\`)"><button onclick="removeImage(${c.id},${i})">X</button></div>`).join("")}</div><input type="file" accept="image/*" multiple onchange="addImagesToCase(${c.id},this)"><button class="smallBtn" onclick="editCase(${c.id})">제목/설명 수정</button><button class="danger" onclick="deleteCase(${c.id})">삭제</button></div>`).join("");}
document.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem("renovaAdmin")==="1"){loginScreenOff();loadAll();}});