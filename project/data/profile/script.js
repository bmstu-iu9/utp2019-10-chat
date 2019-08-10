
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