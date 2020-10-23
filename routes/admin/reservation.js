const express = require('express')
const app = express()
const router = express.Router()

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    res.render('admin/reservation')
})


router.get('/create', (req, res)=>{
    res.render('admin/reservation/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/reservation/dummy')
})


module.exports = router;