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

	const req = new XMLHttpRequest()
	req.open('POST', '/req/setnewpassword.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		message.textContent = req.status + " " + req.responseText;
	}
	message.textContent = "Пароль успешно изменён";
	let curURL = new URL(window.location.href)
	req.send(JSON.stringify({
		newPassword: inputPassword.value,
		hash: curURL.searchParams.get("hash")
	}))
});

inputPassword.addEventListener("input", () =>  {
	inputPassword.classList.remove("errorInput");
	message.classList.remove("errorMessage");
	message.textContent = "";
	message.style.color = "green";
});
