const singUpForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
document.getElementById("createAccount").addEventListener("click",()=>{
  loginForm.style.display="none";
 singUpForm.style.display="block";
})
document.getElementById("logIn").addEventListener("click",()=>{
    singUpForm.style.display="none";
    loginForm.style.display="block";
})
