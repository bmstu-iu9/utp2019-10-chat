const rcodes = {
    SUCCESS: 0,
    NOT_AUTHORIZED: 9
}

const windowSet = document.getElementById('windowSet');
const profile = document.getElementById('profile');
const exit = document.getElementById('exit');
const setting = document.getElementById('setting');
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