import express from 'express'
import { Persistence } from '../Persistence'
import {
    LoginPayload,
    QueryResponse,
} from '../shared/data_definitions/NetworkDefinitions'
import bcrypt from 'bcrypt'
import { IPersistenceUser, UserStatus } from '../PersistenceDefinitions'

const router = express.Router()

const login = (
    username: string,
    userId: string,
    token: string,
    res,
    storage?: string,
    status?: UserStatus
): void => {
    let queryResponse: QueryResponse = {} as QueryResponse
    let payload: LoginPayload = {} as LoginPayload

    queryResponse.successMessage = `${username} logged in`
    storage = storage || 'test'

    payload = {
        userId,
        token,
        storage,
        needsInit: status === UserStatus.needsInit,
    }
    queryResponse.payload = payload
    res.status(200).send(queryResponse)
}

router.post('/login', async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    let unauthorized = new Error(`user '${username}' unauthorized`)
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

    const user: IPersistenceUser = await Persistence.instance().findUser(
        username
    )

    if (user) {
        const validPassword = await bcrypt.compare(password, user.password)
        console.log('validPassword', validPassword)
        if (!validPassword) {
            next(unauthorized)
        }

        login(username, user._id, 'abc123', res, user.storage, user.status)

        //technically there should be another call from the client that sets this,
        //but for now, we're going to assume everything worked on the client
        if (user.status === UserStatus.needsInit) {
            user.status = UserStatus.initialized

            try {
                const result = await Persistence.instance().updateUser(user)
                console.log('update result: ', result)
            } catch (error) {
                console.log('error updating user: ', error)
            }
        }

        return
    } else {
        next(unauthorized)
    }
})

module.exports = router
