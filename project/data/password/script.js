const inputPassword = document.getElementById('inputPassword');
const saveBotton = document.getElementById('saveBotton');
const message = document.getElementById('message');

saveBotton.addEventListener("click", (e) => {
	e.preventDefault();
	inputPassword.style.borderColor = "transperent";
	if (!inputPassword.value) {
		inputPassword.classList.add("errorInput");
		message.style.color = "red";
		message.textContent = "Введите пароль";
		return;
	}
	if (inputPassword.value.length < 6) {
		inputPassword.classList.add("errorInput");
		message.style.color = "red";
		message.textContent = "Пароль должен содержать минимум 6 символов";
		return;
	}
	message.textContent = "Пароль успешно изменён";
});

inputPassword.addEventListener("input", () =>  {
	inputPassword.classList.remove("errorInput");
	message.classList.remove("errorMessage");
	message.textContent = "";
	message.style.color = "green";
});