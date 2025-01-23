const singUpForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const validator = {
    userName: /^[a-zA-Z0-9]{3,15}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    email: /^.+@+.+\.+[a-zA-Z]{2,3}$/,


}
const signUpInputs = singUpForm.querySelectorAll("input");
export let currentUser;


document.getElementById("createAccount").addEventListener("click",()=>{
  loginForm.style.display="none";
 singUpForm.style.display="block";
    for (let i = 0; i < signUpInputs.length; i++) {
        let inp = signUpInputs[i];
        inp.addEventListener("input", () => {
            inp.parentElement.querySelector(".error").style.display = "none";
            validateInput(inp);
        });
    }
})

document.getElementById("logIn").addEventListener("click",()=>{
    singUpForm.style.display="none";
    loginForm.style.display="block";
})


singUpForm.addEventListener("submit",(e)=>validateSignUp(e));
loginForm.addEventListener("submit",(e)=>validateLogin(e));


function validateInput(inp) {
    let property = validator[inp.name];
    if (!property) {
        inp.className="error-border";
        return false;
    }
    if (!property.test(inp.value)) {
        inp.parentElement.querySelector(".error").style.display = "block";
        inp.className="error-border";
        return false;
    }
    inp.className="success-border";
    return true;
}

function validateSignUp(e) {
   e.preventDefault();
   let userNameInp = singUpForm.querySelector("#createUser");

   userNameInp.parentElement.querySelector("#userFoundError").style.display="none";


  let users=(JSON.parse(localStorage.getItem("users")))||[];

   if (users.some(user => user.userName === userNameInp.value)){
       userNameInp.parentElement.querySelector("#userFoundError").style.display="block";
       return false;
   }
   const inputs = singUpForm.querySelectorAll("input");


    let validated = true;
    for (let i = 0; i < inputs.length; i++) {
        if (!validateInput(inputs[i])) {
            validated = false;
        }
    }
    if (validated) {
        const newUser ={};
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            newUser[input.name]= input.value;
        }
        users.push(newUser);
        localStorage.setItem("users",JSON.stringify(users));
        document.querySelector("form").submit();
    }

}

function validateLogin(e){
    e.preventDefault();
    let validated=true;
    const userName = loginForm.querySelector("#userLogin").value;
    const  password= loginForm.querySelector("#passwordLogin").value;
    const users = JSON.parse(localStorage.getItem("users"));
    if (!users) validated = false;
    else {
       currentUser = users.find(user=>user.userName===userName && user.password===password);
    }
    if(!validated|| !currentUser)loginForm.querySelector("#passwordLoginError").style.display="block";
    else window.location.href= "test.html"
}
