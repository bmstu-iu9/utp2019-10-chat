'use strict'
exports.invoke = null

const path = require('path')

exports.PORT = 3000;
exports.SCRIPTS_PATH = path.dirname(module.filename)
exports.SERVER_PATH = path.resolve(exports.SCRIPTS_PATH, '..')
exports.DATA_PATH = path.resolve(exports.SERVER_PATH, 'data')