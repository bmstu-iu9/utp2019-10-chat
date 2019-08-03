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

let data = -1;


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

<<<<<<< Updated upstream
socket.on('dialogs', (data) => { 
    if (data.dialogs.length === 0) { 
    groupChat.style.display = 'none'; 
    } 
    topSetting.classList.add('not_active');
    for (let i = data.dialogs.length - 1; i >= 0; i--) { 
    let div = document.createElement('div'); 
    div.className = 'nameDialog'; 
    div.addEventListener('click', (e) => {
        e.preventDefault();
        nameChat.textContent = data.dialogs[i].name;
        topSetting.classList.remove('not_active');
    });
    if (div.textContent === '') { 
    groupChat.style.display = 'none'; 
    } 
    div.textContent = data.dialogs[i].name; 
    groupChat.appendChild(div); 
    groupChat.parentNode.insertBefore(div, groupChat); 
    } 
    });

socket.on('dialog', (data) => {
    listdialogs.options[listdialogs.options.length] = new Option(data.name, data.id)
    chat.hidden = false
});

socket.on('dialog', (data) => {
    listdialogs.options[listdialogs.options.length] = new Option(data.name,data.id)
    chat.hidden = false
})

socket.on('message', (data) => {
  if (listdialogs.value == data.dialogId)
      chatTable.innerHTML += '</td><td>' + data.name +'</td><td>'+'</td><td>'
          + data.message.replace(/\n/g, '<br>')+'</td><td>' +'</td><td>'+ (new Date(data.date)).toLocaleString() + '</td></tr>'
})

socket.on('messages', (data) => {
  if (listdialogs.value == data.dialogId) {
      chatTable.innerHTML = ''
      data.messages.forEach((mes) => {
          chatTable.innerHTML += '</td><td>' + mes.name +'</td><td>'+'</td><td>' +
              mes.message.replace(/\n/g, '<br>')+'</td><td>' +'</td><td>'+ (new Date(mes.date)).toLocaleString() + '</td></tr>'
      })
  }
})
=======
socket.on('dialogs', (data) => {
    if (data.dialogs.length === 0) {
        groupChat.style.display = 'none';
    }
    topSetting.classList.add('not_active');
    for (let i = data.dialogs.length - 1; i >= 0; i--) {
        let div = document.createElement('div');
        div.className = 'nameDialog';
        div.addEventListener('click', (e) => {
            e.preventDefault();
            nameChat.textContent = data.dialogs[i].name;
            topSetting.classList.remove('not_active');
        });
        if (div.textContent === '') {
            groupChat.style.display = 'none';
        }
        div.textContent = data.dialogs[i].name;
        groupChat.appendChild(div);
        groupChat.parentNode.insertBefore(div, groupChat);
    }
});
>>>>>>> Stashed changes
