const DEF_SERV=[
{t:"상가 원상복구",d:"카페·음식점·미용실 등 임대 만료 후 원상복구",img:"service1.svg"},
{t:"사무실 철거",d:"파티션·바닥재·조명 철거와 원상복구",img:"service2.svg"},
{t:"주택·아파트 인테리어 철거",d:"기존 마감재와 붙박이 철거",img:"service3.svg"},
{t:"건설 폐기물 처리",d:"합법적 폐기물 분리·반출·현장 정리",img:"service4.svg"},
{t:"폐기물 처리",d:"현장 폐기물 반출과 정리",img:"service5.svg"},
{t:"현장 정리",d:"작업 후 현장 청소와 마감 확인",img:"service6.svg"}
];
const DEF_WORK=[
{t:"홍대 카페 원상복구",m:"상가 · 30평",img:"work1.svg"},
{t:"역삼동 사무실 철거",m:"사무실 · 80평",img:"work2.svg"},
{t:"분당 피부과 원복",m:"학원·클리닉 · 60평",img:"work3.svg"},
{t:"용산 아파트 철거",m:"주택 · 34평",img:"work4.svg"}
];
function get(k,f){return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}
function tel(v){return (v||"").replace(/[^0-9]/g,"")}
function render(){
 const main=get("renovaMain",{phone:"010-8476-7456",hero:""});
 if(main.hero) heroBg.style.backgroundImage=`linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.35)),url(${main.hero})`;
 navPhone.textContent=main.phone; navPhone.href="tel:"+tel(main.phone); callBtn.href="tel:"+tel(main.phone); quotePhone.textContent=main.phone; footPhone.textContent=main.phone;
 const services=get("renovaServices",DEF_SERV);
 serviceGrid.innerHTML=services.map((x,i)=>`<article class="service" onclick="openService(${i})"><img src="${x.img||'service1.svg'}"><div class="body"><h3>${x.t}</h3><p>${x.d}</p></div></article>`).join("");
 const works=get("renovaWorks",DEF_WORK);
 workGrid.innerHTML=works.map((x,i)=>`<article class="work"><img onclick="openImage('${x.img}')" src="${x.img||'work1.svg'}"><div class="body"><h3>${x.t}</h3><p>${x.m||''}</p></div></article>`).join("");
 const about=get("renovaAbout",{img:"about.svg"}); aboutImg.src=about.img || "about.svg";
}
function openService(i){const x=get("renovaServices",DEF_SERV)[i];modalBody.innerHTML=`<h2>${x.t}</h2><p>${x.d}</p><img src="${x.img||'service1.svg'}">`;modal.classList.add("show")}
function openImage(src){modalBody.innerHTML=`<img src="${src}">`;modal.classList.add("show")}
function closeModal(){modal.classList.remove("show")}
render();