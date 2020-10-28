const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const Contact = require('../../models/Contact')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Contact.find()
    .populate('user')
    .then(contacts=>{
        res.render('admin/contact', {contacts: contacts})
    })
    .catch(err=>console.log(err))
})



router.get('/loggedUser/:id', (req, res)=>{
    Contact.find({_id: req.params.id})
    .populate('user')
    .then(contacts=>{
        res.render('admin/contact/loggedInContacts', {contacts: contacts})
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('admin/contact/create')
})


router.get('/dummy', (req, res)=>{
    res.render('admin/contact/dummy')
})


router.get('/edit/:id', (req, res)=>{
    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        res.render('admin/contact/edit', {contact: contact})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    const newContact = new Contact()
    newContact.user = req.user.id
    newContact.subject = req.body.subject
    newContact.message = req.body.message
    newContact.save()
    .then(savedContact=>{
        req.flash('success_msg', 'Contact has been created successfully :)')
        if(loggedUser.role === 'Admin'){
            res.redirect('/admin/contact')
        }else{
            res.redirect(`/admin/contact/loggedUser/${req.user.id}`)
        }
    })
    .catch(err=>console.log(err))

})



router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        const newContact = new Contact()
        newContact.user = req.user.id
        newContact.subject = faker.random.word()
        newContact.message = faker.lorem.sentence()
        newContact.save()
        .then(savedContact=>{
            req.flash('success_msg', `${req.body.number} dummy contacts has been created successfully :)`)
            res.redirect('/admin/contact')
        })
        .catch(err=>console.log(err))
    }
})



router.post('/update/:id', (req, res)=>{

    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        contact.subject = req.body.subject
        contact.message = req.body.message
        contact.save()
        .then(savedContact=>{
            req.flash('success_msg', 'Contact has been updated successfully :)')
            if(loggedUser.role === 'Admin'){
                res.redirect('/admin/contact')
            }else{
                res.redirect(`/admin/contact/loggedUser/${req.user.id}`)
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Contact.findOne({_id: req.params.id})
    .then(contact=>{
        contact.delete()
        .then(response=>{
            req.flash('success_msg', `${contact.subject} has been deleted successfully :)`)
            if(loggedUser.role === 'Admin'){
                res.redirect('/admin/contact')
            }else{
                res.redirect(`/admin/contact/loggedUser/${req.user.id}`)
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})




// Multi Action on contacts
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Contact.find({_id: req.body.checkboxes})
    .then(contacts=>{
        contacts.forEach(contact=>{
            contact.delete()
            .then(response=>{
                req.flash('success_msg', `${contact.subject} has been deleted successfully :)`)
                if(loggedUser.role === 'Admin'){
                    res.redirect('/admin/contact')
                }else{
                    res.redirect(`/admin/contact/loggedUser/${req.user.id}`)
                }
            })
            .catch(err=>console.log(err)) 
        })        
    })
     .catch(err=>console.log(err))    
})


module.exports = router