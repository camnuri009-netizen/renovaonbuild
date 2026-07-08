const ADMIN_PASSWORD="1234";

function login(){
  const pw=document.getElementById("password").value;
  if(pw===ADMIN_PASSWORD){
    localStorage.setItem("renovaAdmin","1");
    document.getElementById("login").style.display="none";
    document.getElementById("dash").style.display="block";
    loadSettings();
    renderCases();
  }else{
    alert("비밀번호가 다릅니다.");
  }
}

function logout(){
  localStorage.removeItem("renovaAdmin");
  location.reload();
}

function getSettings(){
  return JSON.parse(localStorage.getItem("renovaSettings") || "{}");
}

function saveSettings(){
  const settings={
    phone1:document.getElementById("phone1").value.trim(),
    phone2:document.getElementById("phone2").value.trim(),
    blog:document.getElementById("blog").value.trim(),
    kakao:document.getElementById("kakao").value.trim()
  };
  localStorage.setItem("renovaSettings", JSON.stringify(settings));
  alert("기본 정보가 저장되었습니다.");
}

function loadSettings(){
  const s=getSettings();
  document.getElementById("phone1").value=s.phone1 || "010-8476-7456";
  document.getElementById("phone2").value=s.phone2 || "010-9169-7557";
  document.getElementById("blog").value=s.blog || "";
  document.getElementById("kakao").value=s.kakao || "";
}

function getCases(){
  return JSON.parse(localStorage.getItem("renovaCases") || "[]");
}

function saveCases(cases){
  localStorage.setItem("renovaCases", JSON.stringify(cases));
}

function saveCase(){
  const title=document.getElementById("caseTitle").value.trim();
  const desc=document.getElementById("caseDesc").value.trim();
  const files=Array.from(document.getElementById("caseImages").files).slice(0,10);

  if(!title){alert("제목을 입력해주세요.");return;}

  const readers=files.map(file=>new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.readAsDataURL(file);
  }));

  Promise.all(readers).then(images=>{
    const cases=getCases();
    cases.unshift({id:Date.now(),title,desc,images});
    saveCases(cases);
    document.getElementById("caseTitle").value="";
    document.getElementById("caseDesc").value="";
    document.getElementById("caseImages").value="";
    renderCases();
    alert("시공사례가 저장되었습니다.");
  });
}

function deleteCase(id){
  if(!confirm("삭제하시겠습니까?")) return;
  saveCases(getCases().filter(item=>item.id!==id));
  renderCases();
}

function renderCases(){
  const list=document.getElementById("caseList");
  if(!list) return;
  const cases=getCases();
  if(cases.length===0){
    list.innerHTML="<p>등록된 시공사례가 없습니다.</p>";
    return;
  }
  list.innerHTML=cases.map(item=>`
    <div class="caseItem">
      <h3>${item.title}</h3>
      <p>${item.desc || ""}</p>
      <div class="caseImages">
        ${(item.images || []).map(img=>`<img src="${img}" alt="">`).join("")}
      </div>
      <button class="danger" onclick="deleteCase(${item.id})">삭제</button>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem("renovaAdmin")==="1"){
    document.getElementById("login").style.display="none";
    document.getElementById("dash").style.display="block";
    loadSettings();
    renderCases();
  }
});
