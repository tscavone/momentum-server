import express from 'express'

const router = express.Router()

router.get('/login', (req, res, next) => {
    // if (req.body.name === 'tony' && req.body.password === 'abc123') {
    //     res.status(200).send({ message: 'logged in' })
    // } else {
    //     res.status(401).send({ message: 'password incorrect' })
    // }

    console.log(req.body)
})

module.exports = router
