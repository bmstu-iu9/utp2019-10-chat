const windowSet = document.getElementById('windowSet');
const profile = document.getElementById('profile');
const exit = document.getElementById('exit');
const setting = document.getElementById('setting');
const nameChat = document.getElementById('nameChat');
const topSetting = document.getElementById('topSetting');
const chat = document.getElementById('chat');
const dialogUserInfo = document.getElementById('dialogUserInfo');
const out = document.getElementById('out');
const chatTable = document.getElementById('chatTable');
const submit = document.getElementById('submit');
const dialogName = document.getElementById('dialogName');
const create = document.getElementById('create');
const users = document.getElementById('users');
const windowNameChat = document.getElementById('windowNameChat');
const memberWindow = document.getElementById('memberWindow');
const members = document.getElementById('members');
const signMembers = document.getElementById('signMembers');
const close = document.getElementById('close');
const openModal2 = document.getElementById('openModal2');
let data = -1;
let dialogIdE = null;
let nameC = null;


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
        switch (data.errcode) {
            case null:
                window.location.href = "/profile.html";
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


const socket = io();

socket.on('cur', (data) => {
    setting.textContent = data.name;
});

socket.on('connect', () => {
    socket.emit('dialogs', {})
})

socket.on('dialogs', (data) => {
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
            alert(data.dialogs[i].id);
            socket.emit('messages', {
                dialogId: dialogIdE
            });
        });
        div.textContent = data.dialogs[i].name;
        windowNameChat.append(div);
        if (prevDialog === data.dialogs[i].dialogId) {
            dialogIdE = prevDialog;
            socket.emit('messages', {
                dialogId: dialogIdE
            });
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
    document.getElementById('dialogInLeft' + data.dialogId).remove();
    if (dialogIdE === data.dialogId) {
        dialogIdE = null;
        nameChat.textContent = '';
        chat.style.display = 'none';
        topSetting.classList.add('not_active');
        out.classList.add('not_active');
        dialogUserInfo.classList.add('not_active');
    }
});

out.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('delete', {
        dialogId: dialogIdE
    });
});

socket.on('dialog', (data) => {
    let div = document.createElement('div');
    div.className = 'nameDialog';
    alert(data.dialogId);
    div.id = 'dialogInLeft' + data.dialogId;
    div.textContent = nameC;
    windowNameChat.prepend(div);
    div.addEventListener('click', (e) => {
        e.preventDefault();
        if (dialogIdE === data.dialogId) {
            return;
        }
        nameChat.textContent = nameC;
        topSetting.classList.remove('not_active');
        out.classList.remove('not_active')
        dialogUserInfo.classList.remove('not_active')
        chat.style.display = 'flex';
        dialogIdE = data.dialogId;
        socket.emit('messages', {
            dialogId: dialogIdE
        });
    });
});

function modalClose() {
    if (location.hash == '#openModal') {
        location.hash = '';
    }
}

create.addEventListener('click', (e) => {
    create.disabled = true;
    e.preventDefault();
    if (!dialogName.value) {
        dialogName.classList.add("errorInput");
        return;
    }
    socket.emit('dialog', {
        name: dialogName.value,
        users: users.value === '' ? [] : users.value.split('\n')
    });
    nameC = dialogName.value;
    dialogName.value = '';
    users.value = '';
    modalClose();
});


dialogName.addEventListener('input', () => {
    dialogName.classList.remove("errorInput");
    create.disabled = false;
})

messageText.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        if (messageText.value == '') return
        socket.emit('message', {
            dialogId: dialogIdE,
            message: messageText.value
        })
        messageText.value = '';
    }
});

socket.on('users', (data) => {
    let div = document.createElement('div');
    div.className = 'nameMember';
    div.textContent = data.brigadier;
    signMembers.before(div);
    for (let i = data.users.length - 1; i >= 0; i--) {
        let div2 = document.createElement('div');
        div2.className = 'nameMember';
        div2.textContent = data.users[i];
        members.append(div2);
        close.addEventListener('click', () => {
            div.remove();
            for (let i = data.users.length - 1; i >= 0; i--) {
                div2.remove();
            }
        });
    }
    if (data.users.length === 0) {
        close.addEventListener('click', () => { 
            div.remove();
        })
    }
});

dialogUserInfo.addEventListener('click', () => {
    socket.emit('users', {
        dialogId: dialogIdE
    })
});