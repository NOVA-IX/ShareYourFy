// For Sign Up
const signupForm = document.querySelector('#signup');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['email'].value;
    const password = signupForm['Pwd2'].value;
    
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        alert("Signed Up Successfully!!");
        document.getElementById('myModal2').style.display = 'none';
    });
});

// For sign In
const signinForm = document.querySelector('#signin');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email1 = signinForm['Username'].value;
    const password1 = signinForm['Pwd'].value;

    auth.signInWithEmailAndPassword(email1, password1).then(cred => {
        alert("Login successful!!!!");
        document.getElementById('myModal').style.display = 'none';
    });
});