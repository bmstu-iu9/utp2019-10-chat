const rcodes = {
	SUCCESS: 0,
	LOGIN_OR_PASSWORD_INCORRECT: 1,
	EMAIL_INCORRECT: 2,
	EMAIL_ALREADY_EXISTS: 3,
	USERNAME_ALREADY_EXISTS: 4,
	EMAIL_AND_USERNAME_ALREADY_EXISTS: 5,
	FAILED_TO_SEND_EMAIL: 6,
	JSON_SYNTAX_ERROR: 7,
	AUTHORIZED_ALREADY: 8,
	NOT_AUTHORIZED: 9
}

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const regButton = document.getElementById('regButton');
const regEmail = document.getElementById('regEmail');
const regUserName = document.getElementById('regUserName');
const regPassword = document.getElementById('regPassword');
const regError = document.getElementById('regError');
const loginButton = document.getElementById('loginButton');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
let data = -1;

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


regButton.addEventListener('click', (e) => {
	e.preventDefault();
	regButton.disabled = true;
	if (!regEmail.value) {
		regEmail.classList.add("errorInput");
	}
	if (!regUserName.value) {
		regUserName.classList.add("errorInput");
	}
	if (!regPassword.value) {
		regPassword.classList.add("errorInput");
	}
	const req = new XMLHttpRequest()
	req.open('POST', '/req/registration.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		data = JSON.parse(req.responseText);
		debugger;
		switch (data.err) {
			case rcodes.EMAIL_ALREADY_EXISTS:
				regError.textContent = "Данный Email уже используется";
				regError.style.display = "block";
				regEmail.classList.add("errorInput");
				break;
			case rcodes.USERNAME_ALREADY_EXISTS:
				regError.textContent = "Этот Ник уже занят";
				regError.style.display = "block";
				regUserName.classList.add("errorInput");
				break;
			case rcodes.EMAIL_AND_USERNAME_ALREADY_EXISTS:
				regError.textContent = "Данный Email и Ник уже заняты";
				regError.style.display = "block";
				regEmail.classList.add("errorInput");
				regUserName.classList.add("errorInput");
				break;
		}
	}
	req.send(JSON.stringify({
		email: regEmail.value,
		username: regUserName.value,
		password: regPassword.value
	}))
});

regEmail.addEventListener("input", () => {
	regEmail.classList.remove("errorInput");
	regButton.disabled = false;
	switch (data.err) {
		case rcodes.EMAIL_AND_USERNAME_ALREADY_EXISTS:
		case rcodes.EMAIL_ALREADY_EXISTS:
			regError.style.display = "none";
	}
});

regUserName.addEventListener("input", () => {
	regUserName.classList.remove("errorInput");
	regButton.disabled = false;
	switch (data.err) {
		case rcodes.EMAIL_AND_USERNAME_ALREADY_EXISTS:
		case rcodes.USERNAME_ALREADY_EXISTS:
			regError.style.display = "none";
	}
});

regPassword.addEventListener("input", () => {
	regPassword.classList.remove("errorInput");
});

loginButton.addEventListener('click', (e) => {
	e.preventDefault();
	loginButton.disabled = true;
	if (!loginEmail.value) {
		loginEmail.classList.add("errorInput");
	}
	if (!loginPassword.value) {
		loginPassword.classList.add("errorInput");
	}
	const req = new XMLHttpRequest()
	req.open('POST', '/req/login.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		data = JSON.parse(req.responseText);
		debugger;
		switch (data.err) {
			case rcodes.LOGIN_OR_PASSWORD_INCORRECT:
				loginError.textContent = "Неверный Email или пароль";
				loginError.style.display = "block";
				loginPassword.classList.add("errorInput");
				break;
			case rcodes.AUTHORIZED_ALREADY:
				loginError.textContent = "Вы уже вошли в аккаунт, пожалуйста обновите страницу";
				loginButton.disabled = false;
				break;
			// case rcodes.SUCCESS:


		}
	}
	req.send(JSON.stringify({
		email: loginEmail.value,
		password: loginPassword.value
	}))
});


loginEmail.addEventListener("focus", () => {
	loginButton.disabled = false;
	loginEmail.classList.remove("errorInput");
	loginPassword.classList.remove("errorInput");
	loginError.style.display = "none";
});

loginPassword.addEventListener("keydown", () => {
	loginButton.disabled = false;
	loginPassword.classList.remove("errorInput");
	loginError.style.display = "none";
});

//закрытие модального окна по клавише Esc
function modalClose() {
    if (location.hash == '#openModal') {
        location.hash = '';
    }
}

// Handle ESC key (key code 27)
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 27) {
        modalClose();
    }
});