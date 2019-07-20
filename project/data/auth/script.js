
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
const tmpEmail = document.getElementById('tmpEmail');
const forgotButton = document.getElementById('forgotButton');
const forgotEmail = document.getElementById('forgotEmail');
const forgotEr = document.getElementById('forgotEr');
const lgEm = document.getElementById('lgEm');
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
	if (!regUserName.value) {
		regUserName.classList.add("errorInput");
	}
		if (!regEmail.value) {
		regEmail.classList.add("errorInput");
	}
	if (regEmail.value.indexOf("@") === -1 && regEmail.value.length !== 0) {
		tmpEmail.textContent = "Адрес электронной почты должен содержать символ @"
		tmpEmail.style.display = "block";
		regEmail.classList.add("errorInput");
		return;
	}

	if (!regPassword.value) {
		regPassword.classList.add("errorInput");
	}
	const req = new XMLHttpRequest()
	req.open('POST', '/req/registration.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		data = JSON.parse(req.responseText);
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
			case rcodes.FAILED_TO_SEND_EMAIL:
				regError.textContent = "Неудалось отправить письмо с ссылкой на верификацию на элекротнную почту. Пожалуйста, попробуйте позже.";
				regError.style.display = "block";
				regButton.disabled = false;
				setTimeout(() => {
					regError.style.display = "none";
				}, 5000);
				break;
			case rcodes.SUCCESS:
				regError.style.color = "green";
				regError.textContent = "Мы выслали вам письмо для верификации аккаунта";
				regError.style.display = "block";
				regEmail.addEventListener("input", () => {
					regButton.disabled = true;
				});
				regUserName.addEventListener("input", () => {
					regButton.disabled = true;
				});
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
	tmpEmail.style.display = "none";
	switch (data.err) {
		case rcodes.FAILED_TO_SEND_EMAIL:
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
		setTimeout(() => {
			loginEmail.classList.remove("errorInput");
		}, 1000);
	}
	if (loginEmail.value.indexOf("@") === -1 && loginEmail.value.length !== 0) {
		lgEm.textContent = "Адрес электронной почты должен содержать символ @"
		lgEm.style.display = "block";
		loginEmail.classList.add("errorInput");
		setTimeout(() => {
			loginEmail.classList.remove("errorInput");
		}, 1000);
		return;
	}
	if (!loginPassword.value) {
		loginPassword.classList.add("errorInput");
		setTimeout(() => {
			loginPassword.classList.remove("errorInput");
		}, 1000);
	}
	const req = new XMLHttpRequest()
	req.open('POST', '/req/login.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		data = JSON.parse(req.responseText);
		switch (data.err) {
			case rcodes.LOGIN_OR_PASSWORD_INCORRECT:
				loginError.textContent = "Неверный Email или пароль";
				loginError.style.display = "block";
				loginPassword.classList.add("errorInput");
				loginEmail.classList.add("errorInput");
				setTimeout(() => {
					loginPassword.classList.remove("errorInput");
					loginEmail.classList.remove("errorInput");
				}, 1000);
				break;
			case rcodes.AUTHORIZED_ALREADY:
				loginError.textContent = "Вы уже вошли в аккаунт, пожалуйста обновите страницу";
				loginButton.disabled = false;
				break;
				case rcodes.SUCCESS:
					window.location.href="/auth/chat.html"



		}
	}
	req.send(JSON.stringify({
		email: loginEmail.value,
		password: loginPassword.value
	}))
});


loginEmail.addEventListener("input", () => {
	loginButton.disabled = false;
	lgEm.style.display = "none";
	loginError.style.display = "none";
});

loginPassword.addEventListener("input", () => {
	loginButton.disabled = false;
	loginError.style.display = "none";
});

forgotButton.addEventListener("click", (e) => {
	e.preventDefault();
	forgotButton.disabled = true;
	if (!forgotEmail.value) {
		forgotEmail.classList.add("errorInput");
		return;
	}
	if (forgotEmail.value.indexOf("@") === -1 && forgotEmail.value.length !== 0) {
		forgotEr.textContent = "Адрес электронной почты должен содержать символ @"
		forgotEr.style.display = "block";
		forgotEmail.classList.add("errorInput");
		return;
	}
	const req = new XMLHttpRequest()
	req.open('POST', '/req/forgotPassword.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		data = JSON.parse(req.responseText);
		switch (data.err) {
			case rcodes.EMAIL_INCORRECT:
				forgotEr.textContent = "Аккаунта с такой электронной почтой не существует";
				forgotEr.style.display = "block";
				forgotEmail.classList.add("errorInput");
				break;

		}
	}
	req.send(JSON.stringify({
		email: forgotEmail.value
	}));
});

forgotEmail.addEventListener("input", () => {
	forgotEmail.classList.remove("errorInput");
	forgotButton.disabled = false;
	switch (data.err) {
		case rcodes.EMAIL_INCORRECT:
			regError.style.display = "none";
	}
})

function modalClose() {
	if (location.hash == '#openModal') {
		location.hash = '';
	}
}


document.addEventListener('keydown', function (e) {
	if (e.keyCode == 27) {
		modalClose();
	}
});