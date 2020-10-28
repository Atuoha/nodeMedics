const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const User = require('../../models/User')
const fs = require('fs')
const {isEmpty} = require('../../helpers/upload-helpers')
const bcrypt = require('bcryptjs')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    User.find()
    .then(users=>{
        res.render('admin/users', {users: users})
    })
    .catch(err=>console.log(err))
})

router.get('/create', (req, res)=>{
    res.render('admin/users/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/users/dummy')
})

router.get('/edit/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('admin/users/edit', {user: user})
    })
    .catch(err=>console.log(err))
})


router.get('/profile/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(profile=>{
        res.render('admin/profile', {profile: profile})
    })
    .catch(err=>console.log(err))
})

router.get('/show/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('admin/users/show', {user: user})
    })
    .catch(err=>console.log(err))
})

router.post('/create', (req, res)=>{

    let filename = ''
    if(!isEmpty(req.files)){
        let file = req.files.file
        filename = Date.now() + '-' + file.name
        let uploadDir = './public/uploads/'
        file.mv(uploadDir + filename, err=>{
            if(err) console.log(err)
        })
    }

    const newUser = new User()
    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.phone = req.body.phone
    newUser.role = req.body.role
    newUser.status = req.body.status
    newUser.file = filename
    newUser.password = req.body.password

    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            if(err)console.log(err)
            newUser.password = hash
            newUser.save()
            .then(savedUser=>{
                req.flash('success_msg', `${savedUser.name} has been created as a user successfully :)`)
                res.redirect('/admin/users')
            })
            .catch(err=>console.log(err))
        })
    })
})


router.post('/dummy', (req, res)=>{
    for(let i = 0; i < req.body.number; i++){
        const newUser = new User()
        newUser.name = faker.name.firstName() + ' ' + faker.name.lastName()
        newUser.email =  faker.internet.email()
        newUser.phone =  '+234-000-0000-000'
        newUser.role = 'Subscriber'
        newUser.status = 'Active'
        newUser.file = 'default.png'
        newUser.password = 'secret'
    
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash('secret', salt, (err, hash)=>{
                if(err)console.log(err)
                newUser.password = hash
                newUser.save()
                .then(savedUser=>{
                    req.flash('success_msg', `${req.body.number} dummy users has been created as users successfully :)`)
                    res.redirect('/admin/users')
                })
                .catch(err=>console.log(err))
            })
        })
    }
})

router.post('/update/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        let filename = user.file
        if(!isEmpty(req.files)){
            let file =  req.files.file
            filename = Date.now() + '-' + file.name
            file.mv('./public/uploads/' + filename, err=>{
                if(err)console.log(err)
            })

            if(user.file !== 'default.png' && user.file !== ''){
                fs.unlink('./public/uploads/' + user.file, err=>{
                    if(err)console.log(`eRROR removing file: ${err}`)
                })
            }
           
        }

        if(req.body.password){
            user.name = req.body.name
            user.email = req.body.email
            user.phone = req.body.phone
            user.role = req.body.role
            user.status = req.body.status
            user.file = filename
            user.password = req.body.password

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err)console.log(err)
                    user.password = hash
                    user.save()
                    .then(savedUser=>{
                        req.flash('success_msg', 'Update was successfully :)')
                        // if(loggedUser.role === 'Admin'){
                        //     res.redirect('/admin/users')
                        // }else{
                        //     res.redirect(`/admin/users/profile/${req.user.id}`)
                        // }
                        res.redirect("back")
                    })
                    .catch(err=>console.log(err))
                })
            })
        }else{
            user.name = req.body.name
            user.email = req.body.email
            user.phone = req.body.phone
            user.role = req.body.role
            user.status = req.body.status
            user.file = filename

            user.save()
            .then(savedUser=>{
                req.flash('success_msg', 'Update was successfully :)')
                if(loggedUser.role === 'Admin'){
                    res.redirect('/admin/users')
                }else{
                    res.redirect(`/admin/users/profile/${req.user.id}`)
                }
            })
            .catch(err=>console.log(err))
        }

    })
    .catch(err=>console.log(`Can't find user ${err}`))
})


router.get('/delete/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{

        if(user.file !== 'default.png' && user.file !== ''){
            fs.unlink('./public/uploads/' + user.file, err=>{
                if(err)console.log(`eRROR removing file: ${err}`)
            })
        }

        user.delete()
        .then(response=>{
            req.flash('success_msg', `${response.name} was successfully deleted :)`)
            res.redirect('/admin/users')
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})





// Multi Action on Users
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    User.find({_id: req.body.checkboxes})
    .then(users=>{
        users.forEach(appoint=>{
            if(req.body.action === 'unactive'){
                appoint.status = 'Unactive'
                appoint.save()
                .then(response=>{
                    req.flash('success_msg', 'Users updated successfully')
                        res.redirect('/admin/user')
                })
                .catch(err=>console.log(err))
            }else if(req.body.action === 'active'){

                appoint.status = 'Active'
                appoint.save()
                .then(response=>{
                    req.flash('success_msg', 'Users updated successfully')
                        res.redirect('/admin/user')
                })
                .catch(err=>console.log(err))

            }else{
                if(user.file !== 'default.png'){
                    fs.unlink('./public/uploads/' + user.file, err=>{
                        if(err)console.log(err)
                    })
                }
                appoint.delete()
                .then(response=>{
                    req.flash('success_msg', 'user(s) deleted successfully')
                        res.redirect('/admin/user')
                })
                .catch(err=>console.log(err)) 
            }
            
        })
            
    })
     .catch(err=>console.log(err))

    
})


module.exports = router