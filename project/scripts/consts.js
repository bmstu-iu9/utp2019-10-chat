'use strict'
exports.invoke = null

const path = require('path')

exports.PORT = 8080
exports.SCRIPTS_PATH = path.dirname(module.filename)
exports.SERVER_PATH = path.join(exports.SCRIPTS_PATH, '..')
exports.DATA_PATH = path.join(exports.SERVER_PATH, 'data')
exports.RCODES_PATH = path.join(exports.DATA_PATH, 'responsecodes.js')
exports.USERS_PATH = path.join(exports.SERVER_PATH, 'users')