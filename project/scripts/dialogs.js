'use strict'

const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const fs = require('fs')
const users = require('./users')

exports.DIALOGS_PATH = pathModule.join(consts.DIALOGS_PATH, 'dialogs.json')

exports.addDialog = async (name,peoples) => {
    
	let dialogs = await JSON.parse(fs.readFileSync(exports.DIALOGS_PATH))
    let useraccept = await JSON.parse(fs.readFileSync(users.USERACCEPT_PATH))
    
    let id = Object.keys(dialogs).length

    dialogs[id] = {id : id, name : name, users : peoples, messages : {}}

    console.log(useraccept)
    Object.keys(useraccept).forEach(element => {
        console.log( useraccept[element])
        useraccept[element].dialogs[id] = {}
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

exports.getMessages = async (id) => {
    let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    return dialogs[id].messages
}

exports.addDialog("Test", ["dron","dorn"])