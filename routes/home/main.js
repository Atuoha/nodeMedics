const express = require('express')
const app = express()
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Contact = require('../../models/Contact')
const Department = require('../../models/Department')
const Doctor = require('../../models/Doctor')
const Appointment = require('../../models/Appointment')
const Research = require('../../models/Research')
const Media = require('../../models/Media')






router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home'
    next()
})

router.get('/', (req, res)=>{

    // const promises = [
    //     Post.countDocuments().exec(),
    //     Comment.countDocuments().exec(),
    //     Reply.countDocuments().exec(),
    //     Category.countDocuments().exec(),
    //     User.countDocuments().exec()
    // ];
    // Promise.all(promises).then(([posts, comments, replies, categories, users])=>{
    //     res.render('admin/index', {users: users, posts: posts, comments: comments, replies:replies, categories:categories})
    // })

    Department.find()
    .then(depts=>{
        Doctor.find()
        .then(docs=>{
            Research.find()
            .then(labs=>{
                Media.find()
                .then(medias=>{
                     res.render('home', {depts: depts, docs: docs, labs: labs, medias: medias})
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
   
})

router.get('/login', (req, res)=>{

    if(req.user){
        res.redirect('/admin')
    }else{
        res.render('home/login')
    }
})

router.get('/register', (req, res)=>{

    if(req.user){
        res.redirect('/admin')
    }else{
        res.render('home/register')
    }
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



router.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/')
})




router.post('/contact', (req, res)=>{

    const newContact = new Contact()
    newContact.user = req.user.id
    newContact.subject = req.body.subject
    newContact.message = req.body.message
    newContact.save()
    .then(savedContact=>{
        req.flash('success_msg', 'Contact has been created successfully :)')
        res.redirect('/')
    })
    .catch(err=>console.log(err))

})




router.post('/appointment', (req, res)=>{
    const newAppoint = new Appointment
    newAppoint.user = req.user.id
    newAppoint.doctor = req.body.doctor
    newAppoint.department = req.body.department
    newAppoint.date = req.body.date
    newAppoint.message = req.body.message
    newAppoint.save()
    .then(savedAppoint=>{
        req.flash('success_msg', 'Appointment created successfully :)')
        res.redirect('/')      
    })
    .catch(err=>console.log(err))
})



module.exports = router
