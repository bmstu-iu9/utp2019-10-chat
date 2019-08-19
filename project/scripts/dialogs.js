'use strict'

const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const fs = require('fs')
const users = require('./users')


exports.USERDIALOGS_PATH = pathModule.join(consts.USERS_PATH, 'dialogs.json')

class DialogError extends Error {
	constructor(msg, code) {
		super(msg)
		this.code = code
		this.name = "DialogError"
	}
}

exports.DialogError = DialogError

const normalizeUsers = (userAccept, users, curUser) => {
	let uniqueUsers = {}
	
	uniqueUsers[curUser] = true
	users.forEach((u) => {
		uniqueUsers[u] = true
	})
	delete uniqueUsers[curUser]
	
	users = Object.keys(uniqueUsers)
	
	let notExistsUsers = []
	users.forEach((u) => {
		if (!userAccept[u] || userAccept[u].notApproved)
			notExistsUsers.push(u)
	})
	
	if (notExistsUsers.length) {
		let exc = new DialogError('Users not exists', 'RCODE_USERS_NOT_EXISTS')
		exc.notExistsUsers = notExistsUsers
		throw exc
	}
	
	return users
}

exports.addDialog = async (name,brigadier,peoples) => {
	if (name == '')
		throw new DialogError('Dialog name empty', 'RCODE_DIALOG_NAME_EMPTY')
	
	let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
	peoples = normalizeUsers(useraccept, peoples, brigadier)
	
	let dialogs = await jsonfile.read(exports.USERDIALOGS_PATH)
    let id = dialogs.length
    dialogs.length++
    dialogs[id] = name
    
    let dialog = {name : name, brigadier: brigadier, users : peoples, messages : []}

    peoples.forEach((element) => {
        useraccept[element].dialogs.push(id)
    })
    
	useraccept[brigadier].dialogs.push(id)

	await jsonfile.write(pathModule.join(consts.DIALOGS_PATH,id+'.json'), dialog)
	try {
		await jsonfile.write(users.USERACCEPT_PATH, useraccept)
		try {
			await jsonfile.write(exports.USERDIALOGS_PATH, dialogs)
		} catch (err) {
			for (let element in peoples) {
		        useraccept[element].dialogs.pop()
			}
			useraccept[brigadier].dialogs.pop()
		    await jsonfile.write(users.USERACCEPT_PATH, useraccept)
		    throw err
		}
	} catch (err) {
		await fs.unlink(pathModule.join(consts.DIALOGS_PATH,id+'.json'))
		throw err
	}
	
	peoples.push(brigadier)
	return {id: id, users: peoples}
}

exports.getUserDialogs = async (user, begin, end) => {
    const useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    const dialogs = await jsonfile.read(exports.USERDIALOGS_PATH)
    return useraccept[user].dialogs.slice(begin, end).map((id) => {
    	return {id: id, name: dialogs[id]}
    })
}

const userExitDialog = async (dialog, user,id) => {
	const i = dialog.users.indexOf(user)
	let useraccept
	if (i < 0 && user != dialog.brigadier) {
		throw new DialogError('Users not contains in dialog', 'RCODE_USER_IS_NOT_IN_DIALOG')
	}
	
	useraccept = await jsonfile.read(users.USERACCEPT_PATH)
	const j = useraccept[user].dialogs.indexOf(id)
	useraccept[user].dialogs.splice(j, 1)
	
	if (i >= 0) {
		dialog.users.splice(i, 1)
	} else if (user == dialog.brigadier) {
		dialog.brigadier = null
	}
	
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
	try {
		await jsonfile.write(pathModule.join(consts.DIALOGS_PATH, id + '.json'), dialog)
	} catch (err) {
		useraccept[user].dialogs.splice(i, 0, id)
		await jsonfile.write(users.USERACCEPT_PATH, useraccept)
		throw err
	}
}

exports.userDeleteDialog = async (user, id) => {
	let dialog = await jsonfile.read(pathModule.join(consts.DIALOGS_PATH, id + '.json'))
	await userExitDialog(dialog, user, id)
	return dialog.brigadier
}

exports.deleteUserDialogOnly = async (user, dialogs) => {
	let dialog = await jsonfile.read(pathModule.join(consts.DIALOGS_PATH, id + '.json'))

	const i = dialog.users.indexOf(user)
	
	if (i >= 0) {
		dialog.users.splice(i, 1)
	} else if (user == dialog.brigadier) {
		dialog.brigadier = null
	}
		
	await jsonfile.write(pathModule.join(consts.DIALOGS_PATH, id + '.json'), dialog)
}

exports.rmUserFromDialog = async (src, dest, id) => {
	let dialog = await jsonfile.read(pathModule.join(consts.DIALOGS_PATH, id + '.json'))
	if (src != dialog.brigadier)
		throw new DialogError('Remove user by not brigadier', 'RCODE_PERMISSION_DENIED')

	if (dest == src)
		throw new DialogError('Brigadier self removing', 'RCODE_BRIGADIER_SELF_REMOVING')
	
	await userExitDialog(dialog, dest, id)
}

exports.getDialogUsers = async (user, id) => {
	const dialog = await jsonfile.read(pathModule.join(consts.DIALOGS_PATH, id + '.json'))
	if (!dialog.users.includes(user) && dialog.brigadier != user) {
		throw new DialogError('Dialog users access permission denied', 'RCODE_PERMISSION_DENIED')
	}
	
    return {brigadier: dialog.brigadier, users: dialog.users}
}

exports.addMessage = async (id,name,message,date) => {
	if (message == '')
		throw new DialogError('Message empty', 'RCODE_MESSAGE_EMPTY')
	
	let dialog = await jsonfile.read(pathModule.join(consts.DIALOGS_PATH, id + '.json' ))
    if (name != '' && !dialog.users.includes(name) && dialog.brigadier != name)
    	throw new DialogError('Send message permission denied', 'RCODE_PERMISSION_DENIED')
	
	if (!dialog.brigadier && name != '')
		throw new DialogError('Dialog closed', 'RCODE_DIALOG_CLOSED')
    
    dialog.messages[dialog.messages.length] = {name : name, message : message, date : date}
	await jsonfile.write(pathModule.join(consts.DIALOGS_PATH,id+'.json'), dialog)
	dialog.users.push(dialog.brigadier)
	return dialog.users
}

exports.getMessages = async (id,name,begin, end) => {
    let dialog = await jsonfile.read(pathModule.join(consts.DIALOGS_PATH, id + '.json' ))
    
    if (!dialog.users.includes(name) && dialog.brigadier != name)
    	throw new DialogError('Get messages permission denied', 'RCODE_PERMISSION_DENIED')
    
    return {messages: dialog.messages.slice(begin,end), brigadier: dialog.brigadier}
}


exports.addUserInDialog = async (brigadier, user,id) => {
    let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    let dialog = await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + '.json' ))
    
    if (dialog.brigadier != brigadier)
    	throw new DialogError('Add user permission denied', 'RCODE_PERMISSION_DENIED')
    
    if (!useraccept[user] || useraccept[user].notApproved)
    	throw new DialogError('Adding not exists user', 'RCODE_USER_NOT_EXISTS')
    
    if(dialog.users.includes(user) || dialog.brigadier == user)
    	throw new DialogError('Adding already exists user', 'RCODE_USER_ALREADY_EXISTS')
    
    
    useraccept[user].dialogs.push(id)
    dialog.users.push(user)
    
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+'.json'), dialog)
	try {
		await jsonfile.write(users.USERACCEPT_PATH, useraccept)
	} catch (err) {
		dialog.users.pop()
		await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+'.json'), dialog)
		throw err
	}
}
