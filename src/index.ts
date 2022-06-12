var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var { Persistence } = require('./Persistence')
require('dotenv').config({ path: '.env' })
console.log(process.env)
export {}

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())
app.use(require('./routes/login'))

const port = 3001

Persistence.instance()
    .init()
    .then(() => {
        // start the Express server
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error('Unable to initialize server:  ', err)
        process.exit()
    })
