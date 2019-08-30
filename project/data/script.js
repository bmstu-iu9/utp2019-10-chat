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
const members = document.getElementById('members');
const signMembers = document.getElementById('signMembers');
const close = document.getElementById('close');
const messageText = document.getElementById('messageText');
const add = document.getElementById('add');
const addName = document.getElementById('addName');
const closeSetWindow = document.getElementById('closeSetWindow');
const deleteName = document.getElementById('deleteName');
const deleteButton = document.getElementById('deleteButton');
const delInform = document.getElementById('delInform');
const closeCreate = document.getElementById('closeCreate');
let data = null;
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
    window.location.href = "/profile";
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
                window.location.href = "/auth";
                break;
            case 'NOT_AUTHORIZED':
                window.location.href = "/auth";
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
    dialogUserInfo.classList.remove('color');
    out.classList.remove('color');
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
            if (div.textContent.length > 25) {
                nameChat.classList.remove('nameChat');
                nameChat.classList.add('longName');
            } else {
                nameChat.classList.remove('longName');
                nameChat.classList.add('nameChat');
            }
            nameChat.textContent = data.dialogs[i].name;
            out.classList.remove('not_active');
            out.classList.add('color');
            dialogUserInfo.classList.remove('not_active');
            dialogUserInfo.classList.add('color');
            chat.style.display = 'flex';
            dialogIdE = data.dialogs[i].id;
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
    let messageBlock = document.createElement('div');
    let div = document.createElement('div');
    messageBlock.className = 'messageBlock';
    if (data.name === setting.textContent) {
        messageBlock.classList.add('myMessage')
    }
    if (data.name === '') {
        div.className = 'createNewChatName'
        div.textContent = data.message;
    } else {
        div.className = 'messageContent';
        div.textContent = data.name + ':\n' + data.message;
    }
    messageBlock.append(div);
    chatTable.append(messageBlock);
})

socket.on('messages', (data) => {
    if (data.brigadier === setting.textContent) {
        topSetting.classList.remove('not_active');
    }
    chatTable.innerHTML = '';
    data.messages.forEach((mes) => {
        let messageBlock = document.createElement('div');
        let div = document.createElement('div');
        messageBlock.className = 'messageBlock';
        if (mes.name === setting.textContent) {
            messageBlock.classList.add('myMessage')
        }
        if (mes.name === '') {
            div.className = 'createNewChatName'
            div.textContent = mes.message;
        } else {
            div.className = 'messageContent';
            div.textContent = mes.name + ':\n' + mes.message;
        }
        messageBlock.append(div);
        chatTable.append(messageBlock);
    });
});

socket.on('err', (data) => {
    alert(JSON.stringify(data));
})

submit.addEventListener('click', () => {
    if (messageText.value == '') return;
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
        out.classList.remove('color');
        topSetting.classList.add('not_active');
        out.classList.add('not_active');
        dialogUserInfo.classList.add('not_active');
        dialogUserInfo.classList.remove('color');
    }
});

out.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('delete', {
        dialogId: dialogIdE
    });
});

socket.on('dialog', (data) => {
    out.classList.remove('color');
    dialogUserInfo.classList.remove('color');
    let div = document.createElement('div');
    div.className = 'nameDialog';
    div.id = 'dialogInLeft' + data.id;
    div.textContent = nameC;
    windowNameChat.prepend(div);
    div.addEventListener('click', (e) => {
        e.preventDefault();
        if (div.textContent.length > 25) {
            nameChat.classList.remove('nameChat');
            nameChat.classList.add('longName');
        } else {
            nameChat.classList.remove('longName');
            nameChat.classList.add('nameChat');
        }
        nameChat.textContent = div.textContent;
        out.classList.remove('not_active');
        out.classList.add('color');
        dialogUserInfo.classList.remove('not_active');
        dialogUserInfo.classList.add('color');
        chat.style.display = 'flex';
        dialogIdE = data.id;
        socket.emit('messages', {
            dialogId: dialogIdE
        });
    });
});

closeCreate.addEventListener('click', () => {
    create.disabled = false;
});

function modalClose() {
    if (location.hash == '#openModal') {
        location.hash = '';
        create.disabled = false;
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
        if (messageText.value === '' || messageText.value === '\n' || messageText.value === '\t')
            return
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

socket.on('add', (data) => {
    addInform.style.display = 'block';
    addInform.style.color = 'green';
    addInform.textContent = data.user + ' добавлен в чат';
});

add.addEventListener('click', () => {
    add.disabled = true;
    if (!addName.value || addName.value === setting.textContent) {
        addName.classList.add("errorInput");
        setTimeout(() => {
			addName.classList.remove("errorInput");
		}, 1000);
        return;
    }
    socket.emit('add', {
        dialogId: dialogIdE,
        user: addName.value
    })
});

deleteButton.addEventListener('click', () => {
    deleteButton.disabled = true;
    if (!deleteName.value || deleteName.value === setting.textContent) {
        deleteName.classList.add("errorInput");
        setTimeout(() => {
			deleteName.classList.remove("errorInput");
		}, 1000);
        return;
    }
    socket.emit('rm', {
        dialogId: dialogIdE,
        user: deleteName.value
    })
});

socket.on('rm', (data) => {
    delInform.style.display = 'block';
    delInform.style.color = 'red';
    delInform.textContent = data.user + ' удален из чата';
});


addName.addEventListener('input', () => {
    addInform.style.display = 'none';
    addName.classList.remove("errorInput");
    add.disabled = false;
});

deleteName.addEventListener('input', () => {
    delInform.style.display = 'none';
    deleteName.classList.remove("errorInput");
    deleteButton.disabled = false;
});

closeSetWindow.addEventListener('click', () => {
    addName.value = '';
    addInform.style.display = 'none';
    deleteName.value = '';
    delInform.style.display = 'none';
    deleteButton.disabled = false;
    add.disabled = false;
});