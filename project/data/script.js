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

socket.on('dialogs', (data) => {
    let div = document.createElement('div');
    div.className = 'nameDialog';		
    div.innerHTML = '';	
    if (div.innerHTML === '') {
        groupChat.style.display = 'none';
    }
    for (let i = data.dialogs.length - 1; i >= 0; i--) { 
        let div2 = div.cloneNode(true); 
        div2.innerHTML = data.dialogs[i].name; 
        groupChat.appendChild(div2); 
        groupChat.parentNode.insertBefore(div2, div.firstChild); 
        }
    // data.dialogs.forEach((element) => {
    //     let div2 = div.cloneNode(true);
    //     div2.innerHTML = element.name;
    //     groupChat.appendChild(div2);
    //     groupChat.parentNode.insertBefore(div2, div.firstChild);
    // })
});

socket.on('dialog', (data) => {
    listdialogs.options[listdialogs.options.length] = new Option(data.name,data.id)
    chat.hidden = false
});