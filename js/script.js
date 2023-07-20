// login function
function userLogIn() {
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    logIn(email, password);
}
function userSignUp() {
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const cfmPassword = document.querySelector('#cfmPassword').value;
    const hawkerCode = document.querySelector('#hawkerCode').value;
    signUp(username, email, password, cfmPassword, hawkerCode);
}