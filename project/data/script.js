const rcodes = {
    SUCCESS: 0,
    NOT_AUTHORIZED: 9
}

const windowSet = document.getElementById('windowSet');
const profile = document.getElementById('profile');
const exit = document.getElementById('exit');
const setting = document.getElementById('setting');
const nameChat = document.getElementById('nameChat');
const nameDialog = document.getElementById('nameDialog');
const groupChat = document.getElementById('groupChat');
const topSetting = document.getElementById('topSetting');
const chat = document.getElementById('chat');
const dialogUserInfo = document.getElementById('dialogUserInfo');
const out = document.getElementById('out');
const chatTable = document.getElementById('chatTable');
const submit = document.getElementById('submit');

let data = -1;
let dialogIdE = null;

setting.addEventListener('click', (e) => {
    e.preventDefault();
    if (windowSet.style.display === "flex") {
        windowSet.style.display = "none";
    } else {
        windowSet.style.display = "flex";
    }
});

profile.addEventListener('click', (e) => {
    e.preventDefault();
    const ereq = new XMLHttpRequest()
    ereq.open('GET', '/req/exit.js', true)
    ereq.onreadystatechange = () => {
        if (ereq.readyState != 4) return;
        data = JSON.parse(ereq.responseText);
        switch (data.err) {
            case rcodes.SUCCESS:
                window.location.href = "/profile.html";
                break;
            case rcodes.NOT_AUTHORIZED:
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
        switch (data.err) {
            case rcodes.SUCCESS:
                window.location.href = "/auth/index.html";
                break;
            case rcodes.NOT_AUTHORIZED:
                window.location.href = "/error.html";
                break;
        }
    }
    ereq.send()
});

const req = new XMLHttpRequest()

req.open('GET', '/req/curuser.js', true)
req.onreadystatechange = (e) => {
    if (req.readyState != 4) return;
    const curUser = JSON.parse(req.responseText).user
    setting.textContent = curUser
}
req.send()

const socket = io();

socket.on('connect', () => {
    socket.emit('dialogs', {})
})

socket.on('dialogs', (data) => {
    if (data.dialogs.length === 0) {
        groupChat.style.display = 'none';
    }
    const prevDialog = dialogIdE;
    chat.style.display = 'none';
    topSetting.classList.add('not_active');
    out.classList.add('not_active');
    dialogUserInfo.classList.add('not_active');
    dialogIdE = null;
    for (let i = data.dialogs.length - 1; i >= 0; i--) {
        let div = document.createElement('div');
        div.className = 'nameDialog';
        div.id = 'dialogInLeft' + data.dialogs[i].id;
        div.addEventListener('click', (e) => {
            e.preventDefault();
            if (dialogIdE === data.dialogs[i].id) {
                return;
            }
            nameChat.textContent = data.dialogs[i].name;
            topSetting.classList.remove('not_active');
            out.classList.remove('not_active')
            dialogUserInfo.classList.remove('not_active')
            chat.style.display = 'flex';
            dialogIdE = data.dialogs[i].id;
            socket.emit('messages', {dialogId: dialogIdE});
        });
        if (div.textContent === '') {
            groupChat.style.display = 'none';
        }
        div.textContent = data.dialogs[i].name;
        groupChat.appendChild(div);
        groupChat.parentNode.insertBefore(div, groupChat);
        if (prevDialog === data.dialogs[i].dialogId) {
            dialogIdE = prevDialog;
            socket.emit('messages', {dialogId: dialogIdE});
        }
    }
});

socket.on('message', (data) => {
    chatTable.innerHTML += '</td><td>' + data.name + '</td><td>' + '</td><td>' +
        data.message.replace(/\n/g, '<br>') + '</td><td>' + '</td><td>' + (new Date(data.date)).toLocaleString() + '</td></tr>'
})

socket.on('messages', (data) => {
    chatTable.innerHTML = '';
    data.messages.forEach((mes) => {
        chatTable.innerHTML += '<tr><td>' + mes.name + '</td><td>' + '</td><td>' +
            mes.message.replace(/\n/g, '<br>') + '</td><td>' + '</td><td>' + (new Date(mes.date)).toLocaleString() + '</td></tr>';
    })
});

socket.on('err', (data) => {
    alert(JSON.stringify(data));
})

submit.addEventListener('click', () => {
    if (messageText.value == '') return
    socket.emit('message', {
        dialogId: dialogIdE,
        message: messageText.value
    })
    messageText.value = ''
});

socket.on('delete', (data) => {
    alert(data.id);
    document.getElementById('dialogInLeft' + data.id).remove(); 
});

out.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('delete', {dialogId: dialogIdE});
});

