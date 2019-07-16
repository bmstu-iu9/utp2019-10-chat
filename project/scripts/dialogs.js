'use strict'

const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const fs = require('fs')
const users = require('./users')

exports.EXTENTION =  '.json'

exports.addDialog = async (name,peoples) => {
    let dialogDirectory = await fs.readdirSync(consts.DIALOGS_PATH)
    let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    
    let id = dialogDirectory.length
    let dialog = {id : id, name : name, users : peoples, messages : []}

    Object.keys(useraccept).forEach(element => {
        useraccept[element].dialogs[dialog.length] = id
    });

	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+this.EXTENTION), dialog)
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
}

exports.getDialog = async (id) => {
    return await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + this.EXTENTION ))
}

exports.getUserDialogs = async (user) => {
    const useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    return useraccept[user].dialogs
}

exports.userExitDialog = async (user,id) => {
    if(!this.containsUserByDialog(user.name,id))
        return;   

    let dialog = this.getDialog(id)
        
    delete dialog.users[user]
    delete user.dialogs[id]
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+this.EXTENTION), dialog)
}

exports.getDialogUsers = async (id) => {
    return this.getDialog(id).users
}

exports.addMessage = async (id,name,message) => {
    let dialog = await this.getDialog(id)
    dialog.messages[dialog.messages.length] = {name : name, message : message, date : new Date()}
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+this.EXTENTION), dialog)
}

exports.getMessages = async (id,count) => {
    const dialog = await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + this.EXTENTION ))
    return dialog.messages.reverse().slice(0,count).reverse()
}

exports.containsUserByDialog = async (name,id) => {
    return this.getDialogUsers(id)[name] != undefined
}

exports.addUserInDialog = async (user,id) => {
    let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
    let dialog = await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + this.EXTENTION ))

    if(this.containsUserByDialog(user.name,id))
        return;

    useraccept[user.name].dialogs[id] = {}
    dialog.users[dialog.users.length]= user.name
    
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+this.EXTENTION), dialog)
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
}
