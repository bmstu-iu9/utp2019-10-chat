'use strict'

const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const crypto = require('crypto')
const users = require('users')

exports.DIALOGS_PATH = pathModule.join(consts.DIALOGS_PATH, 'dialogs.json')

exports.addDialog = async (name,peoples) => {
	let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    let useraccept = await jsonfile.read(users.USERACCEPT_PATH)

    dialogs[dialogs.size] = {id : dialogs.size, name : name, users : peoples}

    useraccept.forEach(element => {
        useraccept[element.name].dialogs[id] = {}
    });

	await jsonfile.write(exports.DIALOGS_PATH, dialogs)
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)
}

exports.getUserDialogs = async (user) => {
    return user.dialogs.map(element => getDialog(element.id))
}

exports.getDialog = async (id) => {
	let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    return dialogs[id]
}

exports.userExitDialog = async (user,id) => {
    let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    delete dialogs[id].users[user]
    delete user.dialogs[id]
	await jsonfile.write(exports.DIALOGS_PATH, dialogs)
}

exports.getDialogUsers = async (id) => {
    return dialogs[id].users
}

exports.addMessage = async (id,name,message) =>{
    let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    dialogs[id].messages.push({name : name, message : message})
	await jsonfile.write(exports.DIALOGS_PATH, dialogs)
}