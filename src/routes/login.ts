import express from 'express'
import { Persistence } from '../Persistence'
const router = express.Router()

router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (
        username === process.env.USERNAME1 &&
        password === process.env.PASSWORD1
    ) {
        res.send({
            token: 'abc123',
            userId: process.env.USERID1,
        })
    } else if (
        username === process.env.USERNAME2 &&
        password === process.env.PASSWORD2
    ) {
        res.send({
            token: 'abc123',
            userId: process.env.USERID2,
        })
    }

    const joe = await Persistence.instance().findUser(username)

    if (joe) {
        res.send({
            token: 'abc123',
            userId: process.env.USERID2,
        })
    } else {
        res.send(401)
    }
})

module.exports = router
