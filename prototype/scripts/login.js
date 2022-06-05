//Login page tab selector with animations

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const resetButton = document.getElementById('go_to_reset');
const loginButton = document.getElementById('go_to_login');
const loginForm = document.getElementById('sign-in-inner');
const resetForm = document.getElementById('forgot-password-inner');

loginButton.addEventListener('click', () => {
	resetForm.classList.add("hidden");
	loginForm.classList.remove("hidden");
	resetForm.classList.remove("unhidden");
	loginForm.classList.add("unhidden");
});

resetButton.addEventListener('click', () => {
	resetForm.classList.add("unhidden");
	loginForm.classList.remove("unhidden");
	resetForm.classList.remove("hidden");
	loginForm.classList.add("hidden");
});

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});