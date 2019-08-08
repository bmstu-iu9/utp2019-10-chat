'use strict'

const path = require('path')

exports.SCRIPTS_PATH = path.dirname(module.filename)
exports.SERVER_PATH = path.join(exports.SCRIPTS_PATH, '..')
exports.DATA_PATH = path.join(exports.SERVER_PATH, 'data')
exports.USERS_PATH = path.join(exports.SERVER_PATH, 'users')
exports.INVOKES_PATH = path.join(exports.SERVER_PATH, 'invokes')
exports.DIALOGS_PATH = path.join(exports.SERVER_PATH, 'dialogs')
exports.HTML_PATH = path.join(exports.SERVER_PATH, 'html')