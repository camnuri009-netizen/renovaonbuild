const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");
if(menuBtn){menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));}

function getSettings(){
  return JSON.parse(localStorage.getItem("renovaSettings") || "{}");
}

function onlyNumber(v){ return (v || "").replace(/[^0-9]/g,""); }

function applySettings(){
  const s=getSettings();
  const p1=s.phone1 || "010-8476-7456";
  const p2=s.phone2 || "010-9169-7557";
  const blog=s.blog || "#";
  const kakao=s.kakao || "#";

  const phone1=document.getElementById("phone1");
  const phone2=document.getElementById("phone2");
  const mainPhone=document.getElementById("mainPhone");
  const blogLink=document.getElementById("blogLink");
  const kakaoLink=document.getElementById("kakaoLink");

  if(phone1){phone1.textContent=p1; phone1.href="tel:"+onlyNumber(p1);}
  if(phone2){phone2.textContent=p2; phone2.href="tel:"+onlyNumber(p2);}
  if(mainPhone){mainPhone.href="tel:"+onlyNumber(p1);}
  if(blogLink){blogLink.href=blog;}
  if(kakaoLink){kakaoLink.href=kakao;}
}

function loadCases(){
  const box=document.getElementById("caseGallery");
  if(!box) return;
  const cases=JSON.parse(localStorage.getItem("renovaCases") || "[]");

  if(cases.length===0){
    box.innerHTML='<article class="caseCard"><div class="emptyImg">시공사례 이미지</div><h3>시공사례 준비중</h3><p>관리자에서 사진과 설명을 등록하면 이곳에 표시됩니다.</p></article>';
    return;
  }

  box.innerHTML=cases.map(item=>`
    <article class="caseCard">
      <div class="thumbs">
        ${(item.images||[]).slice(0,10).map(src=>`<img src="${src}" alt="" onclick="openImage('${src}')">`).join("")}
      </div>
      <h3>${item.title}</h3>
      <p>${item.desc || ""}</p>
    </article>
  `).join("");
}

function openImage(src){
  let modal=document.querySelector(".modal");
  if(!modal){
    modal=document.createElement("div");
    modal.className="modal";
    modal.innerHTML='<img alt="">';
    modal.onclick=()=>modal.classList.remove("show");
    document.body.appendChild(modal);
  }
  modal.querySelector("img").src=src;
  modal.classList.add("show");
}

applySettings();
loadCases();
