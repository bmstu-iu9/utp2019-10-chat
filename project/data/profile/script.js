const windowSet = document.getElementById('windowSet');
const setting = document.getElementById('setting');
const chats = document.getElementById('chats');
const exit = document.getElementById('exit');
const nickname = document.getElementById('nickname')
const container=  document.getElementById('container')
const profileImg = document.getElementById('profileImg')
const resetPwdBtn = document.getElementById('resetPwd')
const oldPwdInput = document.getElementById('oldPwd')
const newPwdInput = document.getElementById('newPwd')
const changePassBtn = document.getElementById('changePassBtn')
const changePwdErr = document.getElementById('changePwdErr')
const currentPwdInput = document.getElementById('currentPwd')
const newMailInput = document.getElementById('newMail')
const changeMailBtn = document.getElementById('changeMailBtn')
const changeMailErr = document.getElementById('changeMailErr')
const passToCloseAllInput = document.getElementById('passToCloseAll')
const closeSessionsBtn = document.getElementById('closeSessions')

setting.addEventListener('click', (e) => {
    e.preventDefault();
    if (windowSet.style.display === "flex") {
        windowSet.style.display = "none";
    } else {
        windowSet.style.display = "flex";
    }
});

chats.addEventListener('click', (e) => {
    e.preventDefault();
    const ereq = new XMLHttpRequest()
    ereq.open('GET', '/req/exit.js', true)
    ereq.onreadystatechange = () => {
        if (ereq.readyState != 4) return;
        data = JSON.parse(ereq.responseText);
        switch (data.errcode) {
            case null:
                window.location.href = "./chat.html";
                break;
            case 'NOT_AUTHORIZED':
                window.location.href = "/error.html";
                break;
        }
    }
    ereq.send()
});

exit.addEventListener('click', (e) => {
    e.preventDefault();
    const ereq = new XMLHttpRequest()
    ereq.open('GET', '/req/exit.js', true)
    ereq.onreadystatechange = () => {
        if (ereq.readyState != 4) return;
        data = JSON.parse(ereq.responseText);
        switch (data.errcode) {
            case null:
                window.location.href = "/auth/index.html";
                break;
            case 'NOT_AUTHORIZED':
                window.location.href = "/error.html";
                break;
        }
    }
    ereq.send()
});

profileImg.addEventListener('click', () => {
    //выбор нового изображения с диска
})

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

const socket = io();

socket.on('cur', (data) => {
	setting.textContent = data.name;
	nickname.textContent = data.name;
});