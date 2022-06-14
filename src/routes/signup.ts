import express from 'express'
import bcrypt from 'bcrypt'
import { IDataUser } from '../shared/data_definitions/AuthedUserDefinitions'
import {
    dateToString,
    checkRequiredFields as checkRequiredFields,
} from '../shared/utils'
import { isGetAccessor } from 'typescript'
import { Persistence } from '../Persistence'

const router = express.Router()

router.post('/signup', async (req, res, next) => {
    let user: IDataUser = {} as IDataUser

    try {
        checkRequiredFields(
            ['_id', 'username', 'password', 'email', 'storage'],
            req.body,
            '/signup'
        )
    } catch (error) {
        // manually catching
        next(error) // passing to default middleware error handler
    }
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
        next(new Error(`Username: "${user.username}" already exists`))
        return
    }

    if (!process.env.SALT) {
        console.error('SALT not found in environment')
        process.exit(1)
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.salt))
    user.password = await bcrypt.hash(req.body.password, salt)

    console.log(`user signed up:`, user.password)

    res.send({
        token: 'abc123',
        userId: user._id,
    })
})

module.exports = router
