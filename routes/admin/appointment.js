const express = require('express')
const app = express()
const router = express.Router()

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    res.render('admin/appointment')
})


router.get('/create', (req, res)=>{
    res.render('admin/appointment/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/appointment/dummy')
})

router.post('/create', (req, res)=>{

})

router.post('/dummy', (req, res)=>{
    
})


module.exports = router;