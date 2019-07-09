'use strict'
exports.invoke = null

const path = require('path')
const ip = require('ip')

exports.PORT = 3000;
exports.SCRIPTS_PATH = path.dirname(module.filename)
exports.SERVER_PATH = path.join(exports.SCRIPTS_PATH, '..')
exports.DATA_PATH = path.join(exports.SERVER_PATH, 'data')
exports.SERVER_IP = ip.address() + ":"+this.PORT
exports.RCODES_PATH = path.join(exports.DATA_PATH, 'responsecodes.js')