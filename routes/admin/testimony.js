const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const Testimony = require('../../models/Testimony')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Testimony.find()
    .populate('user')
    .then(tests=>{
        res.render('admin/testimony', {tests: tests})
    })
    .catch(err=>console.log(err))
})


router.get('/loggedUser/:id', (req, res)=>{
    Testimony.find({_id: req.params.id})
    .populate('user')
    .then(tests=>{
        res.render('admin/testimony/loggedInContacts', {tests: tests})
    })
    .catch(err=>console.log(err))
})

router.get('/create', (req, res)=>{
    res.render('admin/testimony/create')
})


router.get('/dummy', (req, res)=>{
    res.render('admin/testimony/dummy')
})


router.get('/edit/:id', (req, res)=>{
    Testimony.findOne({_id: req.params.id})
    .then(test=>{
        res.render('admin/testimony/edit', {test: test})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    const newTestimony = new Testimony()
    newTestimony.user = req.user.id
    newTestimony.field = req.body.field
    newTestimony.message = req.body.message
    newTestimony.save()
    .then(savedTestimony=>{
        req.flash('success_msg', 'Testimony has been created successfully :)')
        if(loggedUser.role === 'Admin'){
            res.redirect('/admin/testimony')
        }else{
            res.redirect(`/admin/testimony/loggedUser/${req.user.id}`)
        }
    })
    .catch(err=>console.log(err))

})



router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        const newTestimony = new Testimony()
        newTestimony.user = req.user.id
        newTestimony.field = faker.random.word()
        newTestimony.message = faker.lorem.sentence()
        newTestimony.save()
        .then(savedTestimony=>{
            req.flash('success_msg', `${req.body.number} dummy testimonies has been created successfully :)`)
            res.redirect('/admin/testimony')
        })
        .catch(err=>console.log(err))
    }
})



router.post('/update/:id', (req, res)=>{

    Testimony.findOne({_id: req.params.id})
    .then(testimony=>{
        Testimony.field = req.body.field
        Testimony.message = req.body.message
        Testimony.save()
        .then(savedTestimony=>{
            req.flash('success_msg', 'testimony has been updated successfully :)')
            if(loggedUser.role === 'Admin'){
                res.redirect('/admin/testimony')
            }else{
                res.redirect(`/admin/testimony/loggedUser/${req.user.id}`)
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Testimony.findOne({_id: req.params.id})
    .then(testimony=>{
        testimony.delete()
        .then(response=>{
            req.flash('success_msg', `${testimony.field} has been deleted successfully :)`)
            if(loggedUser.role === 'Admin'){
                res.redirect('/admin/testimony')
            }else{
                res.redirect(`/admin/testimony/loggedUser/${req.user.id}`)
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router