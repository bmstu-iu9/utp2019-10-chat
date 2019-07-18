'use strict'

const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const fs = require('fs')
const users = require('./users')

exports.USERDIALOGS_PATH = pathModule.join(consts.USERS_PATH, 'dialogs.json')

exports.addDialog = async (name,peoples) => {
	let dialogs = await jsonfile.read(exports.USERDIALOGS_PATH)
    let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    
    let id = dialogs.length
    dialogs.length++
    dialogs[id] = name
    let dialog = {id : id, name : name, users : peoples, messages : []}

    for (let element in useraccept) {
        useraccept[element].dialogs.push(id)
    }

	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+'.json'), dialog)
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
	await jsonfile.write(exports.USERDIALOGS_PATH, dialogs)
	return id
}

exports.getDialog = async (id) => {
    return await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + '.json' ))
}

exports.getUserDialogs = async (user, begin, end) => {
    const useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    const dialogs = await jsonfile.read(exports.USERDIALOGS_PATH)
    return useraccept[user].dialogs.slice(begin, end).map((id) => {
    	return {id: id, name: dialogs[id]}
    })
}

exports.userExitDialog = async (user,id) => {
    if(!this.containsUserByDialog(user.name,id))
        return;   

    let dialog = this.getDialog(id)
        
    delete dialog.users[user]
    delete user.dialogs[id]
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+'.json'), dialog)
}

exports.getDialogUsers = async (id) => {
    return (await this.getDialog(id)).users
}

exports.addMessage = async (id,name,message,date) => {
	let dialog 
	try {
		dialog = await this.getDialog(id)
	} catch (err) {
		return null
	}
	
    if (!dialog.users.includes(name))
    	return null
    	
    dialog.messages[dialog.messages.length] = {name : name, message : message, date : date}
	await jsonfile.write(pathModule.join(consts.DIALOGS_PATH,id+'.json'), dialog)
	return true
}

exports.getMessages = async (id,name,begin, end) => {
    let dialog
    try {
    	dialog = await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + '.json' ))
    } catch (err) {
    	return null
    }
    
    if (!dialog.users.includes(name))
    	return null
    
    return dialog.messages.reverse().slice(begin,end).reverse()
}

exports.containsUserByDialog = async (name,id) => {
    return this.getDialogUsers(id)[name] != undefined
}

exports.addUserInDialog = async (user,id) => {
    let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    let dialog = await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + '.json' ))

    if(this.containsUserByDialog(user.name,id))
        return;

    useraccept[user.name].dialogs[id] = {}
    dialog.users[dialog.users.length]= user.name
    
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+'.json'), dialog)
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
}
