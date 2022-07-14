import express from 'express'

const router = express.Router()

router.get('/data', async (req, res, next) => {
    res.status(200).send({
        items: ['one', 'two', 'three'],
    })
})

module.exports = router
