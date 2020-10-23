const express = require('express')
const app = express()
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


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
                    .catch(err=> console.log(`Issues with saving user: ${err}`))
                })
            })
       }
   })
   .catch(err=> console.log(`Issues: ${err}`))
})





passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    console.log(`Email: ${email} | Password: ${password}`)


    User.findOne({email: email})
    .then(user=>{
        if(!user){
            console.log('Not recognised')
            return done(null, false, {message: 'Email not recognised!'})
        }else{

            bcrypt.compare(password, user.password, (err, matched)=>{
                if(err)console.log(err)

                if(!matched){
                    return done(null, false, {message: 'Password mismatch. Try again!'})
                }else{
                    return done(null, user)
                }
            })
        }
    })
    .catch(err=> console.log(`iSSues: ${err}`))
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.post('/login', (req, res, next)=>{

    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

module.exports = router
