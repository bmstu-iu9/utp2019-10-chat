const windowSet = document.getElementById('windowSet');
const profile = document.getElementById('profile');
const exit = document.getElementById('exit');
const setting = document.getElementById('setting');


setting.addEventListener('click', (e) => {
    e.preventDefault();
    if (windowSet.style.display === "flex") {
        windowSet.style.display = "none";
    } else {
        windowSet.style.display = "flex";
    } 
});

profile.addEventListener('click',(e)=>{
    window.location.href="/profile.html";
});

exit.addEventListener('click', (e) => {
    window.location.href="/auth/index.html";
});


