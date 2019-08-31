const windowSet = document.getElementById('windowSet');
const setting = document.getElementById('setting');
const chats = document.getElementById('chats');
const exit = document.getElementById('exit');
const nickname = document.getElementById('nickname');
const container=  document.getElementById('container');
const welcomeText = document.getElementById('welcomeText');
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
const changeMailErr = document.getElementById('changeMailErr');
const verErrDiv = document.getElementById('verErrDiv');
const resetPwdBtn = document.getElementById('resetPwd');
const resendMailBtn = document.getElementById('resendMailBtn');
const resendMailErr = document.getElementById('resendMailErr');
const name = document.getElementById('name');
const deleteAccErr = document.getElementById('deleteAccErr');
const resetPwdErr = document.getElementById('resetPwdErr');

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
            if (data.user.length > 17) {
                name.classList.add('name2');
            } else {
                name.classList.add('name');
            }
            setting.textContent = data.user;
            nickname.textContent = data.user;
            welcomeText.textContent = "Приятного общения, " + data.user;
            if (data.notapproved == undefined) {
                nickname.style.color = "green";
                verErrDiv.style.display = "none";
            } else {
                verErrDiv.style.display = "block";
                nickname.style.color = "red";
            }
        }else {
            alert(data.errcode);
        }
    }
    req.send();
});

resendMailBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const req = new XMLHttpRequest();
	req.open('POST', '/req/resend.js', true);
	req.onreadystatechange = () => {
        if (req.readyState != 4) {
            return;
		}
		if (req.status != 200) {
			resendMailErr.style.display = "block"
			resendMailErr.textContent = req.status + ": " + req.statusText;
			resendMailErr.style.color = "green";
			resendMailBtn.disabled = true;
			return
		}
		data = JSON.parse(req.responseText);
		switch (data.errcode) {
			case 'RCODE_NOT_AUTHORIZED' :
				alert("Вы не авторизованы");
				window.location.href = "/auth";
				break;
			case null :
				resendMailErr.style.display = "block"
				resendMailErr.textContent = "Письмо выслано на вашу почту, указанную при регистрации";
				resendMailErr.style.color = "green";
				resendMailBtn.disabled = true;
				break;
			default:
				resendMailErr.style.display = "block"
				resendMailErr.textContent = data.errmessage;
				resendMailErr.style.color = "red";
				resendMailBtn.disabled = true;
				setTimeout(() => {
					resendMailBtn.style.display = "none"
					resendMailBtn.disabled = false;
				}, 5000);
				break;
		}
	}
	req.send();
});

resetPwdBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const req = new XMLHttpRequest();
    req.open('POST', '/req/resetpassword.js');
    req.onreadystatechange = () => {
        if (req.readyState != 4) {
            return;
        }
        if (req.status != 200) {
			resetPwdErr.textContent = req.status + " " + req.statusText;
			resetPwdErr.style.display = "block";
			resetPwdErr.style.color = "red";
			resetPwdBtn.disabled = true;
			setTimeout(() => {
				resetPwdErr.style.display = "none";
				resetPwdBtn.disabled = false;
			}, 2000);
            return;
        }
        data = JSON.parse(req.responseText);
        switch (data.errcode) {
            case null :
				resetPwdErr.textContent = "Успех! Проверьте почту";
				resetPwdErr.style.display = "block";
				resetPwdErr.style.color = "green";
				resetPwdBtn.disabled = true;
				setTimeout(() => {
					resetPwdErr.style.display = "none";
					resetPwdBtn.disabled = false;
				}, 200000);
                break;
            case "RCODE_NOT_AUTHORIZED" :
                alert("Вы не авторизованы");
                window.location.href = "/auth";
                break;
            default: 
				resetPwdErr.textContent = data.errmessage;
				resetPwdErr.style.display = "block";
				resetPwdErr.style.color = "red";
				resetPwdBtn.disabled = true;
				setTimeout(() => {
					resetPwdErr.style.display = "none";
					resetPwdBtn.disabled = false;
				}, 2000);
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
			deleteAccErr.style.display = "block";
			deleteAccErr.style.color = "red";
			deleteAccErr.textContent = req.status + " " + req.statusText;
			deleteAccBut.disabled = "true"
			setTimeout(() => {
				deleteAccBut.style.display = "none";
				deleteAccBut.disabled = "false";
			}, 1500);
            return;
        }
        data = JSON.parse(req.responseText);
        if (data.errcode == null) {
            alert("Аккаунт удален");
            window.location.href = "/auth";
        } else {
			alert(data.errmessage);
			// deleteAccErr.style.display = "block";
			// deleteAccErr.style.color = "red";
			// deleteAccErr.textContent = req.status + " " + req.statusText;
			// deleteAccBut.disabled = "true"
			// setTimeout(() => {
			// 	deleteAccBut.style.display = "none";
			// 	deleteAccBut.disabled = "false";
			// }, 1500);
            window.location.href = "/auth";
        }
    }
    req.send();
});

changePassBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const req = new XMLHttpRequest();
    changePassBtn.disabled = true;
    if (!oldPwdInput.value) {
        oldPwdInput.classList.add("errorInput");
        setTimeout(() => {
            oldPwdInput.classList.remove("errorInput");
            changePassBtn.disabled = false;
        }, 1000);
        return;
    }
    if (!newPwdInput.value) {
        newPwdInput.classList.add("errorInput");
        setTimeout(() => {
            newPwdInput.classList.remove("errorInput");
            changePassBtn.disabled = false;
        }, 1000);
        return;
    }
    req.open('POST', '/req/changepassword.js', true)
    req.onreadystatechange = () => {
        if (req.readyState != 4) return;
        if (req.status != 200) {
            changePwdErr.textContent = req.status + " " + req.statusText;
            changePwdErr.style.display = "block";
            changePwdErr.style.color = "red";
            setTimeout(() => {
                changePwdErr.style.display = "none";
                changePassBtn.disabled = false;
            }, 5000);
            return;
        }
        data = JSON.parse(req.responseText);
        if (data.errcode != null) {
            changePwdErr.textContent = data.errmessage;
            changePwdErr.style.display = "block";
            changePwdErr.style.color = "red";
            setTimeout (() => {
                changePwdErr.style.display = "none";
                changePassBtn.disabled = false;
            }, 5000);
            return;
        }
        changePwdErr.textContent = "Success";
        changePwdErr.style.display = "block";
        changePwdErr.style.color = "green";
        changePassBtn.disabled = false;
        setTimeout (() => {
            changePwdErr.style.display = "none";
        }, 5000);
    }
    req.send(JSON.stringify({password: oldPwdInput.value, newPassword: newPwdInput.value}));
});

changeMailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const req = new XMLHttpRequest();
    changeMailBtn.disabled = true;
    if (!yourMailTxt.value) {
        yourMailTxt.classList.add("errorInput");
        setTimeout(() => {
            yourMailTxt.classList.remove("errorInput");
            changeMailBtn.disabled = false;
        }, 1000);
        return;
    }
    if (!yourPwdTxt.value) {
        yourPwdTxt.classList.add("errorInput");
        setTimeout(() => {
            yourPwdTxt.classList.remove("errorInput");
            changeMailBtn.disabled = false;
        }, 1000);
        return;
    }
    req.open('POST', '/req/changeemail.js', true)
    req.onreadystatechange = () => {
        if (req.readyState != 4) return;
        if (req.status != 200) {
			changeMailErr.textContent = req.status + " " + req.statusText;
			changeMailErr.style.display = "block";
			changeMailErr.style.color = "red";
            return;
        }
        data = JSON.parse(req.responseText);
        if (data.errcode != null) {
			changeMailErr.textContent = data.errmessage;
			changeMailErr.style.display = "block";
			changeMailErr.style.color = "red";
			changeMailBtn.disabled = true;
			setTimeout(() => {
				changeMailErr.style.display = "none";
				changeMailBtn.disabled = false;
			}, 1500);
            return;
        }
        changeMailErr.textContent = "Changed successfully";
		changeMailErr.style.display = "block";
		changeMailErr.style.color = "green";
		setTimeout(() => {
			changeMailErr.style.display = "none";
		}, 1500);
    }
    req.send(JSON.stringify({newEmail: yourMailTxt.value, password: yourPwdTxt.value}));
});

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
                window.location.href = "/auth";
                break;
            case null :
                exitSesErr.style.color = "green"; 
                exitSesErr.style.display = "block";
                setTimeout(() => {
                    exitSesErr.style.display = "none";
                }, 1000);
                window.location.href = "/auth";
                break;
        }
    }
    req.send()
});

chats.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/";
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
                window.location.href = "/auth";
                break;
            case 'NOT_AUTHORIZED':
                window.location.href = "/auth";
                break;
        }
    }
    req.send()
});

function modalClose() {
    if (location.hash == '#openModal' || location.hash == '#openModal2' || location.hash == '#openModal3' || location.hash == '#openModalResend') {
        location.hash = '';
    }
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 27) {
        modalClose();
    }
});
