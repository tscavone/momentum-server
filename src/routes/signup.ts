import express from 'express'
import bcrypt from 'bcrypt'
import { IDataUser } from '../shared/data_definitions/AuthedUserDefinitions'
import { dateToString, checkRequiredFields } from '../shared/utils'
import { QueryResponse } from '../shared/data_definitions/NetworkDefinitions'
import { Persistence } from '../Persistence'

const router = express.Router()

const errorOut = (message: string, errorName: string, next) => {
    let error = new Error(message)
    error.name = errorName
    next(error)
}

router.post('/signup', async (req, res, next) => {
    let user: IDataUser = {} as IDataUser

    if (
        checkRequiredFields(
            ['_id', 'username', 'password', 'email'],
            req.body,
            '/signup',
            next
        )
    )
        return

    const now = new Date()

    user._id = req.body._id
    user.username = req.body.username
    user.first = req.body.first
    user.last = req.body.last
    user.email = req.body.email
    user.created = dateToString(now)
    user.updated = dateToString(now)
    user.deleted = ''

    if (await Persistence.instance().findUser(user.username)) {
        errorOut(`${user.username} already exists`, 'unauthorized', next)
        return
    }

    if (!process.env.SALT) {
        console.error('SALT not found in environment')
        process.exit(1)
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.salt))
    user.password = await bcrypt.hash(req.body.password, salt)

    try {
        console.log(user)
        const result = await Persistence.instance().insertUser(user)

        let queryResponse: QueryResponse = null
        if (result) {
            queryResponse = {
                successMessage: 'successfully created user',
                payload: {
                    token: 'abc123',
                    userId: user._id,
                },
            }
            res.status(201).send(queryResponse)
        } else {
            errorOut('unable to create user', 'internal', next)
            return
        }
    } catch (error) {
        errorOut('unable to create user', 'internal', next)
    }
})

module.exports = router
