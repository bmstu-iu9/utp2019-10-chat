'use strict'

require('./scripts/sessions').init()
require('./scripts/server').init(process.argv[2])
require('./scripts/socket').init()