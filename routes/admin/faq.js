const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const Faq = require('../../models/Faq')



router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Faq.find()
    .populate('user')
    .then(faqs=>{
        res.render('admin/faq', {faqs: faqs})
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('admin/faq/create')
})


router.get('/dummy', (req, res)=>{
    res.render('admin/faq/dummy')
})


router.get('/edit/:id', (req, res)=>{
    Faq.findOne({_id: req.params.id})
    .then(faq=>{
        res.render('admin/faq/edit', {faq: faq})
    })
    .catch(err=>console.log(err))
})

router.post('/create', (req, res)=>{

    const newFaq = new Faq()
    newFaq.user = req.user.id
    newFaq.question = req.body.question
    newFaq.tag = req.body.tag
    newFaq.answer = req.body.answer
    newFaq.save()
    .then(savedFaq=>{
        req.flash('success_msg', `${savedFaq.question} created successfully :)`)
        res.redirect('/admin/faq')
    })
    .catch(err=>console.log(err))

})


router.post('/dummy', (req, res)=>{
    for(let i = 0; i < req.body.number; i++){
        const newFaq = new Faq()
        newFaq.user = req.user.id
        newFaq.question = faker.random.word()
        newFaq.tag = faker.random.word()
        newFaq.answer = faker.lorem.sentence()
        newFaq.save()
        .then(savedFaq=>{
            req.flash('success_msg', `${req.body.number} dummies created successfully :)`)
            res.redirect('/admin/faq')
        })
        .catch(err=>console.log(err))
    }
})


router.post('/update/:id', (req, res)=>{
    Faq.findOne({_id: req.params.id})
    .then(faq=>{
        faq.question = req.body.question
        faq.tag = req.body.tag
        faq.answer = req.body.answer

        faq.save()
        .then(response=>{
            req.flash('success_msg', `${response.question} has been updated  successfully :)`)
            res.redirect('/admin/faq')
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})




router.post('/delete/:id', (req, res)=>{
    Faq.findOne({_id: req.params.id})
    .then(faq=>{
        faq.delete()
        .then(response=>{
            req.flash('success_msg', `${response.question} has been deleted  successfully :)`)
            res.redirect('/admin/faq')
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router