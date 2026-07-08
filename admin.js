const ADMIN_PASSWORD="1234";
const DEFAULT_MENU=[{text:"회사소개",link:"#about"},{text:"서비스",link:"#service"},{text:"진행절차",link:"#process"},{text:"시공사례",link:"#portfolio"},{text:"문의",link:"#contact"}];
const DEFAULT_SERVICES=[{title:"상가철거",desc:"상가, 매장, 카페, 식당 등 내부 철거를 안전하게 진행합니다."},{title:"사무실철거",desc:"집기, 칸막이, 천장, 바닥 철거까지 깔끔하게 정리합니다."},{title:"원상복구",desc:"임대차 종료 전 필요한 원상복구를 일정에 맞춰 진행합니다."},{title:"인테리어",desc:"철거 후 공간에 맞는 인테리어 마감까지 연결합니다."},{title:"폐기물 처리",desc:"현장 폐기물 반출과 정리를 책임지고 진행합니다."},{title:"현장 정리",desc:"공사 후 현장을 깨끗하게 정돈합니다."}];
function getData(k,f){return JSON.parse(localStorage.getItem(k)||JSON.stringify(f));}
function setData(k,v){localStorage.setItem(k,JSON.stringify(v));}
function fileToData(file){return new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result);reader.readAsDataURL(file);});}
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
function loadAbout(){const a=getData("renovaAbout",{title:"현장을 아는 전문 시공 파트너",text:"리노바는 단순히 철거하는 업체가 아니라 다음 공간을 준비하는 전문 파트너입니다.",images:[]});aboutTitle.value=a.title;aboutText.value=a.text;renderAboutPreview(a.images||[]);}
function renderAboutPreview(imgs){aboutPreview.innerHTML=(imgs||[]).slice(0,3).map((img,i)=>`<div class="imgBox"><img src="${img}"><button onclick="removeAboutImage(${i})">X</button></div>`).join("");}
async function saveAbout(){const old=getData("renovaAbout",{images:[]});let images=old.images||[];const files=[...aboutImgs.files].slice(0,3);if(files.length)images=await Promise.all(files.map(fileToData));setData("renovaAbout",{title:aboutTitle.value,text:aboutText.value,images:images.slice(0,3)});aboutImgs.value="";renderAboutPreview(images);alert("회사소개 저장 완료");}
function removeAboutImage(i){const a=getData("renovaAbout",{images:[]});a.images.splice(i,1);setData("renovaAbout",a);renderAboutPreview(a.images||[]);}
function clearAboutImages(){const a=getData("renovaAbout",{title:aboutTitle.value,text:aboutText.value,images:[]});a.images=[];setData("renovaAbout",a);renderAboutPreview([]);}
function loadServices(){const s=getData("renovaServices",DEFAULT_SERVICES);serviceList.innerHTML=s.map((x,i)=>`<div class="row"><input value="${x.title}" data-service-title="${i}"><input value="${x.desc}" data-service-desc="${i}"><button onclick="removeService(${i})">삭제</button></div>`).join("");}
function addService(){const s=getData("renovaServices",DEFAULT_SERVICES);s.push({title:"새 서비스",desc:"서비스 설명"});setData("renovaServices",s);loadServices();}
function removeService(i){const s=getData("renovaServices",DEFAULT_SERVICES);s.splice(i,1);setData("renovaServices",s);loadServices();}
function saveServices(){const rows=[...document.querySelectorAll("[data-service-title]")];setData("renovaServices",rows.map((el,i)=>({title:el.value,desc:document.querySelector(`[data-service-desc="${i}"]`).value})));alert("서비스 저장 완료");}
function loadSettings(){const s=getData("renovaSettings",{brand:"RENOVA",phone1:"010-8476-7456",phone2:"010-9169-7557",blog:"",kakao:""});brand.value=s.brand;phone1.value=s.phone1;phone2.value=s.phone2;blog.value=s.blog;kakao.value=s.kakao;}
function saveSettings(){setData("renovaSettings",{brand:brand.value,phone1:phone1.value,phone2:phone2.value,blog:blog.value,kakao:kakao.value});alert("기본 정보 저장 완료");}
function getCases(){return getData("renovaCases",[]);}
function saveCases(c){setData("renovaCases",c);}
async function saveCase(){const title=caseTitle.value.trim(),desc=caseDesc.value.trim();if(!title){alert("제목을 입력해주세요.");return;}const images=await Promise.all([...caseImages.files].slice(0,10).map(fileToData));const cases=getCases();cases.unshift({id:Date.now(),title,desc,images});saveCases(cases);caseTitle.value="";caseDesc.value="";caseImages.value="";renderCases();alert("시공사례 저장 완료");}
function deleteCase(id){if(confirm("삭제하시겠습니까?")){saveCases(getCases().filter(x=>x.id!==id));renderCases();}}
function editCase(id){const cases=getCases();const c=cases.find(x=>x.id===id);const t=prompt("제목 수정",c.title);if(t===null)return;const d=prompt("설명 수정",c.desc||"");c.title=t;c.desc=d||"";saveCases(cases);renderCases();}
async function addImagesToCase(id,input){const imgs=await Promise.all([...input.files].slice(0,10).map(fileToData));const cases=getCases();const c=cases.find(x=>x.id===id);c.images=[...(c.images||[]),...imgs].slice(0,10);saveCases(cases);renderCases();}
function removeImage(id,i){const cases=getCases();const c=cases.find(x=>x.id===id);c.images.splice(i,1);saveCases(cases);renderCases();}
function renderCases(){const cases=getCases();if(!cases.length){caseList.innerHTML="<p>등록된 시공사례가 없습니다.</p>";return;}caseList.innerHTML=cases.map(c=>`<div class="caseItem"><h3>${c.title}</h3><p>${c.desc||""}</p><div class="caseImages">${(c.images||[]).map((img,i)=>`<div class="imgBox"><img src="${img}"><button onclick="removeImage(${c.id},${i})">X</button></div>`).join("")}</div><input type="file" accept="image/*" multiple onchange="addImagesToCase(${c.id},this)"><button class="smallBtn" onclick="editCase(${c.id})">제목/설명 수정</button><button class="danger" onclick="deleteCase(${c.id})">삭제</button></div>`).join("");}
document.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem("renovaAdmin")==="1"){loginScreenOff();loadAll();}});