import express from 'express'
import { Persistence } from '../Persistence'
import { QueryResponse } from '../shared/data_definitions/NetworkDefinitions'
import bcrypt from 'bcrypt'

const router = express.Router()

const login = (username: string, userId: string, token: string, res): void => {
    let queryResponse: QueryResponse = {} as QueryResponse
    queryResponse.successMessage = `${username} logged in`
    queryResponse.payload = {
        userId,
        token,
    }

    res.status(200).send(queryResponse)
}

router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    let unauthorized = new Error(`user ${username} unauthoized`)
    unauthorized.name = 'unauthorized'
    //for testing
    if (
        username === process.env.USERNAME1 &&
        password === process.env.PASSWORD1
    ) {
        login(username, process.env.USERID1, 'abc123', res)
        return
    } else if (
        username === process.env.USERNAME2 &&
        password === process.env.PASSWORD2
    ) {
        login(username, process.env.USERID2, 'abc123', res)
        return
    }

    const user = await Persistence.instance().findUser(username)

    if (user) {
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            throw unauthorized
        }

        login(username, user._id, 'abc123', res)
        return
    } else {
        throw unauthorized
    }
})

module.exports = router
