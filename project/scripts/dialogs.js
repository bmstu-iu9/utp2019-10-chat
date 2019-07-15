'use strict'

const core = require('./core')
const sessions = require('./sessions')
const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const crypto = require('crypto')

exports.DIALOGS_PATH = pathModule.join(consts.DIALOGS_PATH, 'dialogs.json')
exports.USERACCEPT_PATH = pathModule.join(consts.USERS_PATH, 'accept.json')

exports.addDialog = async (name,users) => {
	let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    let useraccept = await jsonfile.read(exports.USERACCEPT_PATH)

    let salt
    while(dialogs[salt] != undefined)
        salt =  crypto.randomBytes(16).toString('hex')

    dialogs[salt] = {}
    dialogs[salt].name = name
    dialogs[salt].users = users

    users.array.forEach(element => {
        useraccept[element.name].dialogs[salt] = {}
    });

	await jsonfile.write(exports.DIALOGS_PATH, dialogs)
	await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
}

exports.getUserDialogs = async (user) => {
    return user.dialogs.map(element => getDialog(element.salt))
}

exports.getDialog = async (salt) => {
	let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    return dialogs[salt]
}

exports.userExitDialog = async (user,salt) => {
    let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    delete dialogs[salt].users[user]
    delete user.dialogs[salt]
	await jsonfile.write(exports.DIALOGS_PATH, dialogs)
}

exports.deleteDialog = async (salt) => {
    let dialogs = await jsonfile.read(exports.DIALOGS_PATH)
    if (dialogs[salt].users.length == 0 ){
        delete dialogs[salt]
    }
	await jsonfile.write(exports.DIALOGS_PATH, dialogs)
}
