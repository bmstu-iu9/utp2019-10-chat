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
    let dialog = {id : id, name : name, users : peoples, messages : {}}

    Object.keys(useraccept).forEach(element => {
        useraccept[element].dialogs[id] = {}
    });

	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+this.EXTENTION), dialog)
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
}

exports.getUserDialogs = async (user) => {
    return user.dialogs.map(element => getDialog(element.id))
}

exports.getDialog = async (id) => {
    return await jsonfile.read(pathModule.resolve(consts.DIALOGS_PATH, id + this.EXTENTION ))
}

exports.userExitDialog = async (user,id) => {
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
    dialog.messages[Object.keys(dialog.messages).length] = {name : name, message : message}
	await jsonfile.write(pathModule.resolve(consts.DIALOGS_PATH,id+this.EXTENTION), dialog)
}

exports.getMessages = async (id) => {
    let dialog = await this.getDialog(id)
    return dialog.messages
}