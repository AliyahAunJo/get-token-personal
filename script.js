const submitBtn = document.getElementById('submit_btn');
const emailInput = document.getElementById('emailinp');
const nameInput = document.getElementById('nameinp');
const blockToken = document.getElementById('blocktoken');
const copyBtn = document.getElementById('copy_btn');
const tokenShow = document.getElementById('tokenshow');
const msgAlt = document.getElementById("almsg")
blockToken.style.display = "none";


copyBtn.onclick = function() {
  var text = tokenShow.innerText;
  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = text;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
};


submitBtn.addEventListener("click", (event) => {
  event.preventDefault()
  if (emailInput.value !== "" && nameInput.value !== "") {
    localStorage.setItem("emailUser", emailInput.value)
    localStorage.setItem("nameUser", nameInput.value)

    genTokenNotify()
  } else {
    msgAlt.innerText = "ป้อนอีเมลล์และชื่อของคุณ..."
  }
})

function genTokenNotify() {

  var URL = "https://notify-bot.line.me/oauth/authorize?";
  URL += "response_type=code";
  URL += "&client_id=ud3DzjEa8JshuQeW2v4SWr";
  URL += "&redirect_uri=https://aliyahaunjo.github.io/get-token-personal/"; //ถ้า login แล้ว เลือกกลุ่มหรือตัวเอง ให้กลับมาหน้านี้
  URL += "&scope=notify";
  URL += "&state=kruaun_jaidee@g.klaeng.ac.th"; //กำหนด อีเมลของเราเอง  user หรือ อะไรก็ได้ที่สามารถบอกถึงว่าเป็น user ในระบบ         
  console.log(URL)
  window.location.href = URL;
}



window.addEventListener("load", (event) => {
  requestLineNotifyToken();

});

async function requestLineNotifyToken() {
  const urlParams = new URLSearchParams(window.location.search);
  window.history.pushState({}, document.title, "/") //ซ่อน param
  if (urlParams.get("code")) {
    msgAlt.innerText = "รอสักครู่..."
    blockmail.style.display = "none";
    blockname.style.display = "none";
    submitBtn.style.display = "none";
    let codegen = "" + urlParams.get("code");
    console.log(codegen)
    const lineemail = localStorage.getItem("emailUser")
    const linename = localStorage.getItem("nameUser")

    console.log(lineemail)
    let obj = {}
    obj.code = codegen
    obj.nameUser = linename
    obj.emailUser = lineemail
    const resfetch = await fetchData(obj)
    console.log("ตรงนี้", resfetch)
    document.getElementById("tokenshow").innerText = resfetch.tokenLine
    blockToken.style.display = "block";
    msgAlt.innerText = "กรุณาคัดลอก id token เพื่อใช้งานต่อไป..."


  } else {
    // alert("no")
  }


}

const fetchData = (async (obj) => {
  const url = "https://script.google.com/macros/s/AKfycbyOdswjqKIXy3hwfmPVsFcmpIfZ-S09pc-0HZA6vMG5UXMxHMKSW3w6cCurjO73I-jJ/exec"
  const formData = new FormData();
  formData.append('objs', JSON.stringify(obj))

  const response = await fetch(url + "?type=genToken", {
    method: 'POST',
    body: formData
  })

  const json = await response.json()
  // const result = JSON.stringify(json)
  const tokenRes = json.tokenLine
  localStorage.removeItem("emailUser")
  localStorage.removeItem("nameUser")
  return json

})


async function cancleToken() {
  const { value: password } = await Swal.fire({
    title: 'Enter your password',
    input: 'password',
    inputLabel: 'Password',
    inputPlaceholder: 'Enter your password',
    inputAttributes: {
      maxlength: 15,
      autocapitalize: 'off',
      autocorrect: 'off'
    }
  })

  if (password) {
    const url = "https://script.google.com/macros/s/AKfycbyOdswjqKIXy3hwfmPVsFcmpIfZ-S09pc-0HZA6vMG5UXMxHMKSW3w6cCurjO73I-jJ/exec"
    let obj = {}
    obj.password = password
    const formData = new FormData();
    formData.append('objs', JSON.stringify(obj))
    const response = await fetch(url + "?type=revokeToken", {
      method: 'POST',
      body: formData
    })
    const json = await response.json()
    // const result = JSON.stringify(json)
    const status = json.status
    console.log(status)

    Swal.fire(`ยกเลิกบริการ line แจ้งเตือนเรียบร้อย`)
    window.open("https://aliyahaunjo.github.io/get-token-personal/", "_self");
    return json
  }
}
