const PW="1234";let editIndex=0;
const DEF_SERV=[
{t:"상가 원상복구",d:"카페·음식점·미용실 등 임대 만료 후 원상복구",img:"service1.svg"},
{t:"사무실 철거",d:"파티션·바닥재·조명 철거와 원상복구",img:"service2.svg"},
{t:"주택·아파트 인테리어 철거",d:"기존 마감재와 붙박이 철거",img:"service3.svg"},
{t:"건설 폐기물 처리",d:"합법적 폐기물 분리·반출·현장 정리",img:"service4.svg"},
{t:"폐기물 처리",d:"현장 폐기물 반출과 정리",img:"service5.svg"},
{t:"현장 정리",d:"작업 후 현장 청소와 마감 확인",img:"service6.svg"}
];
const DEF_WORK=[{t:"홍대 카페 원상복구",m:"상가 · 30평",img:"work1.svg"},{t:"역삼동 사무실 철거",m:"사무실 · 80평",img:"work2.svg"},{t:"분당 피부과 원복",m:"학원·클리닉 · 60평",img:"work3.svg"},{t:"용산 아파트 철거",m:"주택 · 34평",img:"work4.svg"}];
function get(k,f){return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}
function set(k,v){localStorage.setItem(k,JSON.stringify(v))}
function fileData(f){return new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result);reader.readAsDataURL(f)})}
function loginAdmin(){if(pw.value.trim()===PW){localStorage.setItem("renovaLogin","1");login.style.display="none";dash.style.display="block";loadAll()}else alert("비밀번호가 다릅니다.")}
function logout(){localStorage.removeItem("renovaLogin");location.reload()}
function loadAll(){phoneIn.value=get("renovaMain",{phone:"010-8476-7456"}).phone;loadServices();loadWorks()}
async function saveMain(){const m=get("renovaMain",{phone:"010-8476-7456",hero:""});m.phone=phoneIn.value;if(heroFile.files[0])m.hero=await fileData(heroFile.files[0]);set("renovaMain",m);alert("저장 완료")}
function loadServices(){const arr=get("renovaServices",DEF_SERV);serviceList.innerHTML=arr.map((x,i)=>`<div class="row"><img src="${x.img||'service1.svg'}"><div><b>${x.t}</b><p>${x.d}</p></div><button onclick="editService(${i})">수정/이미지</button></div>`).join("")}
function editService(i){editIndex=i;const x=get("renovaServices",DEF_SERV)[i];sTitle.value=x.t;sDesc.value=x.d;servicePop.classList.add("show")}
async function saveService(){const arr=get("renovaServices",DEF_SERV);arr[editIndex].t=sTitle.value;arr[editIndex].d=sDesc.value;if(sFile.files[0])arr[editIndex].img=await fileData(sFile.files[0]);set("renovaServices",arr);sFile.value="";servicePop.classList.remove("show");loadServices();alert("저장 완료")}
function deleteService(){const arr=get("renovaServices",DEF_SERV);arr.splice(editIndex,1);set("renovaServices",arr);servicePop.classList.remove("show");loadServices()}
function addService(){const arr=get("renovaServices",DEF_SERV);arr.push({t:"새 서비스",d:"설명을 입력하세요",img:"service1.svg"});set("renovaServices",arr);loadServices()}
async function addWork(){const arr=get("renovaWorks",DEF_WORK);const img=workFile.files[0]?await fileData(workFile.files[0]):"work1.svg";arr.unshift({t:workTitle.value||"새 현장",m:workMeta.value||"",img});set("renovaWorks",arr);workTitle.value="";workMeta.value="";workFile.value="";loadWorks();alert("현장 추가 완료")}
function loadWorks(){const arr=get("renovaWorks",DEF_WORK);workList.innerHTML=arr.map((x,i)=>`<div class="imgBox"><img src="${x.img||'work1.svg'}"><button onclick="deleteWork(${i})">X</button><b>${x.t}</b><p>${x.m||""}</p></div>`).join("")}
function deleteWork(i){const arr=get("renovaWorks",DEF_WORK);arr.splice(i,1);set("renovaWorks",arr);loadWorks()}
async function saveAbout(){const a=get("renovaAbout",{img:"about.svg"});if(aboutFile.files[0])a.img=await fileData(aboutFile.files[0]);set("renovaAbout",a);alert("저장 완료")}
document.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem("renovaLogin")==="1"){login.style.display="none";dash.style.display="block";loadAll()}});