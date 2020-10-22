const express = require('express')
const app = express()
const router = express.Router()


router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'home'

    next()
})

router.get('/', (req, res)=>{
    res.render('home')
})

module.exports = router
