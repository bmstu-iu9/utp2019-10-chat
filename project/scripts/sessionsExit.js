'use strict'

const core = require('./core.js')
const sessions = require('./sessions.js')

exports.invoke = (request,response,data) =>{
    let sessionId = core.getCookies(request).sessionId
    sessions.deleteSession(sessionId)
    core.redirect(response, '/auth')  
}