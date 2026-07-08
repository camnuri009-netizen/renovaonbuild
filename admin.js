const ADMIN_PASSWORD="1234";
const DEFAULT_MENU=[{text:"회사소개",link:"#about"},{text:"서비스",link:"#service"},{text:"진행절차",link:"#process"},{text:"시공사례",link:"#portfolio"},{text:"문의",link:"#contact"}];
const DEFAULT_SERVICES=[
{title:"상가철거",desc:"상가, 매장, 카페, 식당 등 내부 철거를 안전하게 진행합니다."},
{title:"사무실철거",desc:"집기, 칸막이, 천장, 바닥 철거까지 깔끔하게 정리합니다."},
{title:"원상복구",desc:"임대차 종료 전 필요한 원상복구를 일정에 맞춰 진행합니다."},
{title:"인테리어",desc:"철거 후 공간에 맞는 인테리어 마감까지 연결합니다."},
{title:"폐기물 처리",desc:"현장 폐기물 반출과 정리를 책임지고 진행합니다."},
{title:"현장 정리",desc:"공사 후 현장을 깨끗하게 정돈합니다."}
];
function getData(k,f){return JSON.parse(localStorage.getItem(k)||JSON.stringify(f));}
function setData(k,v){localStorage.setItem(k,JSON.stringify(v));}
function login(){if(document.getElementById("password").value===ADMIN_PASSWORD){localStorage.setItem("renovaAdmin","1");document.getElementById("login").style.display="none";document.getElementById("dash").style.display="block";loadAll();}else alert("비밀번호가 다릅니다.");}
function logout(){localStorage.removeItem("renovaAdmin");location.reload();}
function fileToData(file){return new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result);reader.readAsDataURL(file);});}

function loadAll(){loadMenu();loadHero();loadAbout();loadServices();loadSettings();renderCases();}

function loadMenu(){const list=document.getElementById("menuList");const menu=getData("renovaMenu",DEFAULT_MENU);list.innerHTML=menu.map((m,i)=>`<div class="row"><input value="${m.text}" data-menu-text="${i}"><input value="${m.link}" data-menu-link="${i}"><button onclick="removeMenu(${i})">삭제</button></div>`).join("");}
function addMenu(){const menu=getData("renovaMenu",DEFAULT_MENU);menu.push({text:"새 메뉴",link:"#"});setData("renovaMenu",menu);loadMenu();}
function removeMenu(i){const menu=getData("renovaMenu",DEFAULT_MENU);menu.splice(i,1);setData("renovaMenu",menu);loadMenu();}
function saveMenu(){const rows=[...document.querySelectorAll("[data-menu-text]")];const menu=rows.map((el,i)=>({text:el.value,link:document.querySelector(`[data-menu-link="${i}"]`).value}));setData("renovaMenu",menu);alert("메뉴가 저장되었습니다.");}

function loadHero(){const h=getData("renovaHero",{small:"RENOVA ONBUILD · PREMIUM",title:"공간을 새롭게,\\n가치를 다시 만들다.",desc:"철거 · 원상복구 · 인테리어 · 폐기물 처리까지 현장에 맞는 정확한 견적과 깔끔한 마감으로 진행합니다.",image:""});heroSmall.value=h.small;heroTitle.value=h.title.replaceAll("<br>","\\n");heroDesc.value=h.desc;}
async function saveHero(){const old=getData("renovaHero",{});let image=old.image||"";const f=heroImage.files[0];if(f)image=await fileToData(f);setData("renovaHero",{small:heroSmall.value,title:heroTitle.value,desc:heroDesc.value,image});alert("배너가 저장되었습니다.");}

function loadAbout(){const a=getData("renovaAbout",{title:"현장을 아는 전문 시공 파트너",text:"리노바는 단순히 철거하는 업체가 아니라 다음 공간을 준비하는 전문 파트너입니다. 현장 확인부터 안전 작업, 폐기물 정리, 원상복구, 인테리어 마감까지 꼼꼼하게 진행합니다."});aboutTitle.value=a.title;aboutText.value=a.text;}
function saveAbout(){setData("renovaAbout",{title:aboutTitle.value,text:aboutText.value});alert("회사소개가 저장되었습니다.");}

function loadServices(){const list=document.getElementById("serviceList");const services=getData("renovaServices",DEFAULT_SERVICES);list.innerHTML=services.map((s,i)=>`<div class="row"><input value="${s.title}" data-service-title="${i}"><input value="${s.desc}" data-service-desc="${i}"><button onclick="removeService(${i})">삭제</button></div>`).join("");}
function addService(){const s=getData("renovaServices",DEFAULT_SERVICES);s.push({title:"새 서비스",desc:"서비스 설명"});setData("renovaServices",s);loadServices();}
function removeService(i){const s=getData("renovaServices",DEFAULT_SERVICES);s.splice(i,1);setData("renovaServices",s);loadServices();}
function saveServices(){const rows=[...document.querySelectorAll("[data-service-title]")];const s=rows.map((el,i)=>({title:el.value,desc:document.querySelector(`[data-service-desc="${i}"]`).value}));setData("renovaServices",s);alert("서비스가 저장되었습니다.");}

function loadSettings(){const s=getData("renovaSettings",{brand:"RENOVA",phone1:"010-8476-7456",phone2:"010-9169-7557",blog:"",kakao:""});brand.value=s.brand||"";phone1.value=s.phone1||"";phone2.value=s.phone2||"";blog.value=s.blog||"";kakao.value=s.kakao||"";}
function saveSettings(){setData("renovaSettings",{brand:brand.value,phone1:phone1.value,phone2:phone2.value,blog:blog.value,kakao:kakao.value});alert("기본 정보가 저장되었습니다.");}

function getCases(){return getData("renovaCases",[]);}
function saveCases(c){setData("renovaCases",c);}
async function saveCase(){const title=caseTitle.value.trim(),desc=caseDesc.value.trim();if(!title){alert("제목을 입력해주세요.");return;}const images=await Promise.all([...caseImages.files].slice(0,10).map(fileToData));const cases=getCases();cases.unshift({id:Date.now(),title,desc,images});saveCases(cases);caseTitle.value="";caseDesc.value="";caseImages.value="";renderCases();alert("시공사례가 저장되었습니다.");}
function deleteCase(id){if(confirm("삭제하시겠습니까?")){saveCases(getCases().filter(x=>x.id!==id));renderCases();}}
function editCase(id){const cases=getCases();const c=cases.find(x=>x.id===id);const title=prompt("제목 수정",c.title);if(title===null)return;const desc=prompt("설명 수정",c.desc||"");c.title=title;c.desc=desc||"";saveCases(cases);renderCases();}
async function addImagesToCase(id,input){const files=[...input.files].slice(0,10);const imgs=await Promise.all(files.map(fileToData));const cases=getCases();const c=cases.find(x=>x.id===id);c.images=[...(c.images||[]),...imgs].slice(0,10);saveCases(cases);renderCases();}
function removeImage(id,idx){const cases=getCases();const c=cases.find(x=>x.id===id);c.images.splice(idx,1);saveCases(cases);renderCases();}
function renderCases(){const list=document.getElementById("caseList");const cases=getCases();if(!cases.length){list.innerHTML="<p>등록된 시공사례가 없습니다.</p>";return;}list.innerHTML=cases.map(c=>`<div class="caseItem"><h3>${c.title}</h3><p>${c.desc||""}</p><div class="caseImages">${(c.images||[]).map((img,i)=>`<div class="imgBox"><img src="${img}"><button onclick="removeImage(${c.id},${i})">X</button></div>`).join("")}</div><input type="file" accept="image/*" multiple onchange="addImagesToCase(${c.id},this)"><button class="smallBtn" onclick="editCase(${c.id})">제목/설명 수정</button><button class="danger" onclick="deleteCase(${c.id})">삭제</button></div>`).join("");}
document.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem("renovaAdmin")==="1"){loginScreenOff();loadAll();}});
function loginScreenOff(){document.getElementById("login").style.display="none";document.getElementById("dash").style.display="block";}
