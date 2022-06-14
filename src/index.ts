var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var { Persistence } = require('./Persistence')
require('dotenv').config({ path: '.env' })

export {}

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())
app.use(require('./routes/login'))
app.use(require('./routes/signup'))
const port = 3001

Persistence.instance()
    .init()
    .then(() => {
        //instantiate error handling middleware
        app.use((error, req, res, next) => {
            console.log('Error Handling Middleware called')
            console.log('Path: ', req.path)
            console.error('Error: ', error)

            if (error.type == 'time-out')
                // arbitrary condition check
                res.status(408).send(error)
            else res.status(500).send(error)
        })

        // start the Express server
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error('Unable to initialize server:  ', err)
        process.exit()
    })
