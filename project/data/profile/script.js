const windowSet = document.getElementById('windowSet');
const setting = document.getElementById('setting');
const chats = document.getElementById('chats');
const exit = document.getElementById('exit');
const nickname = document.getElementById('nickname');
const container=  document.getElementById('container');
const profileImg = document.getElementById('profileImg');
const changePass = document.getElementById('changePass');
const oldPwdInput = document.getElementById('oldPwd');
const newPwdInput = document.getElementById('newPwd');
const changePassBtn = document.getElementById('changePassBtn');
const changePwdErr = document.getElementById('changePwdErr');
const currentPwdInput = document.getElementById('currentPwd');
const newMailInput = document.getElementById('newMail');
const changePassDiv = document.getElementById('changePassDiv');
const closeSessionsBtn = document.getElementById('closeSessions');
const exitSesErr = document.getElementById('exitSesError');
const deleteAccBut = document.getElementById('deleteAcc');
const changeMailBtn = document.getElementById('changeMailBtn');
const yourPwdTxt = document.getElementById('yourPwd');
const yourMailTxt = document.getElementById('yourMail');

setting.addEventListener('click', (e) => {
    e.preventDefault();
    if (windowSet.style.display === "flex") {
        windowSet.style.display = "none";
    } else {
        windowSet.style.display = "flex";
    }
});

document.addEventListener('DOMContentLoaded', (e) => {
	e.preventDefault();
	const req = new XMLHttpRequest();
	req.open('POST', '/req/curuser.js', true);
	req.onreadystatechange = () => {
		if (req.readyState != 4) {
			return;
		}
		if (req.status != 200) {
			alert(req.status + " " + req.statusText);
			return;
		}
		data = JSON.parse(req.responseText);
		if (data.errcode == null) {
			setting.textContent = data.user;
			nickname.textContent = data.user;
			if (data.notapproved == undefined) {
				nickname.style.color = "green";
			} else {
				nickname.style.color = "red";
			}
		}else {
			alert(data.errcode);
		}
	}
	req.send();
});

deleteAccBut.addEventListener('click', (e) => {
	e.preventDefault();
	const req = new XMLHttpRequest();
	req.open('POST', '/req/deleteuser.js', true);
	req.onreadystatechange = () => {
		if (req.readyState != 4) {
			return;
		}
		if (req.status != 200) {
			alert(req.status + " " + req.statusText);
			return;
		}
		data = JSON.parse(req.responseText);
		if (data.errcode == null) {
			alert("Аккаунт удален");
			window.location.href = "/auth/index.html";
		} else {
			alert(data.errcode);
		}
	}
	req.send();
});

changeMailBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const req = new XMLHttpRequest();
	req.open('POST', '/req/changeemail.js', true)
	req.onreadystatechange = () => {
		if (req.readyState != 4) return;
		if (req.status != 200) {
		}
		data = JSON.parse(req.responseText);
		if (data.errcode != null) {
			alert(data.errmessage);
			return;
		}
		alert("Changed successfully");
	}
	req.send(JSON.stringify({newEmail: yourMailTxt.value, password: yourPwdTxt.value}));
});

// changePass.addEventListener('click', e => {
// 	e.preventDefault();
// 	changePassDiv.visibility = "visible";
// })

closeSessionsBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const req = new XMLHttpRequest();
	req.open('POST', '/req/allsessionsexit.js', true);
	req.onreadystatechange = () => {
		if (req.readyState != 4) {
			return;
		}
		if (req.status != 200) {
			exitSesErr.textContent = req.status + ' ' + req.statusText;
			exitSesErr.style.display = "block"
			closeSessionsBtn.disabed = false;
			setTimeout(() => {
				exitSesErr.style.display = "none";
			}, 5000);
			return;
		}
		data = JSON.parse(req.responseText);
		switch (data.errcode) {
			case 'RCODE_NOT_AUTHORIZED' :
				exitSesErr.textContent = "Вы не авторизованы";
				exitSesErr.style.display = "block";
				setTimeout(() => {
					exitSesErr.style.display = "none";
				}, 1000);
				alert("Not authorized");
				break;
			case null :
				exitSesErr.style.color = "green"; 
				exitSesErr.style.display = "block";
				setTimeout(() => {
					exitSesErr.style.display = "none";
				}, 1000);
				window.location.href = "/auth/index.html";
				break;
		}
	}
	req.send()
});

changePassBtn.addEventListener('click', (e) => {
	e.preventDefault();
	// changePassBtn.disabled = true;
	if (!oldPwdInput.value) {
		oldPwdInput.classList.add("errorInput");
		setTimeout(() => {
			oldPwdInput.classList.remove("errorInput")
		}, 1000);
		return;
	}
	if (!newPwdInput.value) {
		newPwdInput.classList.add("errorInput")
		setTimeout(() => {
			newPwdInput.classList.remove("errorInput")
		}, 1000);
		return;
	}
});

chats.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/chat.html";
});

exit.addEventListener('click', (e) => {
    e.preventDefault();
    const req = new XMLHttpRequest()
    req.open('GET', '/req/exit.js', true)
    req.onreadystatechange = () => {
		if (req.readyState != 4) {
			return;
		}
        if (req.readyState != 4) return;
        data = JSON.parse(req.responseText);
        switch (data.errcode) {
            case null:
                window.location.href = "/auth/index.html";
                break;
            case 'NOT_AUTHORIZED':
                window.location.href = "/error.html";
                break;
        }
    }
    req.send()
});

function modalClose() {
	if (location.hash == '#openModal' || location.hash == '#openModal2' || location.hash == '#openModal3') {
		location.hash = '';
	}
}

document.addEventListener('keydown', function (e) {
	if (e.keyCode == 27) {
		modalClose();
	}
});

// const socket = io();

// socket.on('cur', (data) => {
// 	setting.textContent = data.name;
// 	nickname.textContent = data.name;
// });