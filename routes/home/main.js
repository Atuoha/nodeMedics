const express = require('express')
const app = express()
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')


router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'home'

    next()
})

router.get('/', (req, res)=>{
    res.render('home')
})

router.get('/login', (req, res)=>{
    res.render('home/login')
})

router.get('/register', (req, res)=>{
    res.render('home/register')
})

router.post('/register', (req, res)=>{

   User.findOne({email: req.body.email})
   .then(user=>{
       if(user){
           req.flash('error_msg', 'Email already exists :) ')
           res.redirect('/register')
       }else{

            const newUser = new User()
            newUser.name = req.body.name
            newUser.email = req.body.email
            newUser.password = req.body.password
        
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err) console.log(err)

                    newUser.password = hash
                    newUser.save()
                    .then(savedUser=>{
                        req.flash('success_msg', 'Account Registered successfully. Login :)')
                        res.redirect('/login')
                    })
                })
            })
       }
   })
   .catch(err=> console.log(`Issues: ${err}`))
})

module.exports = router
