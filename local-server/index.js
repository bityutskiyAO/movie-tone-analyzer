const http = require('http')
const express = require('express')
const bodyParser = require('body-parser');

const mainRouter = require('./routes')

const router = express.Router()

const hostname = 'localhost'
const port = 4242

router.use(bodyParser.json())
router.use('/api', mainRouter)

const server = http.createServer(router)

server.listen(port, hostname, () => {
    console.log('Starting developer server on: ' + hostname + ':' + port)
})
