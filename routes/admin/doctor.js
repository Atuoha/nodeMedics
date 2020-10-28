const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const Doctor = require('../../models/Doctor')
const fs = require('fs')
const {isEmpty} = require('../../helpers/upload-helpers')

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    Doctor.find()
    .then(doctors=>{
       res.render('admin/doctor', {doctors: doctors})
    })
    .catch(err=>console.log(err))
})

router.get('/create', (req, res)=>{
    res.render('admin/doctor/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/doctor/dummy')
})

router.get('/show/:id', (req, res)=>{

    Doctor.findOne({_id: req.params.id})
    .then(doc=>{
       res.render('admin/doctor/show', {doc: doc})
    })
    .catch(err=>console.log(err))
})

router.get('/edit/:id', (req, res)=>{

    Doctor.findOne({_id: req.params.id})
    .then(doc=>{
       res.render('admin/doctor/edit', {doc: doc})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{

    let filename = ''
    if(!isEmpty(req.files)){
        let file = req.files.file
        filename = Date.now() + '-' + file.name
        let dirUpload = './public/uploads/'
        file.mv(dirUpload + filename, err=>{
            if(err) console.log(err)
        })
    }

    const newDoc = new Doctor()
    newDoc.name = req.body.name
    newDoc.email = req.body.email
    newDoc.field = req.body.field
    newDoc.intro = req.body.intro
    newDoc.file =  filename
    newDoc.date =  new Date()

    newDoc.save()
    .then(savedDoc=>{
        req.flash('success_msg', `${newDoc.name} has been created as a Registered Doctor :)`)
        res.redirect('/admin/doctor')
    })
    .catch(err=>console.log(err))

})


router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){

        const newDoc = new Doctor()
        newDoc.name = faker.name.firstName() + ' ' + faker.name.lastName()
        newDoc.email = faker.internet.email()
        newDoc.intro = faker.lorem.sentence()
        newDoc.field = faker.random.word()
        newDoc.file = 'default.png'
        newDoc.date = new Date()
        newDoc.save()
        .then(savedDoc=>{
            req.flash('success_msg', `${req.body.number} Dummy Doctors registered successfully :)`)
            res.redirect('/admin/doctor')
        })
        .catch(err=>console.log(err))
    }
})

router.post('/update/:id', (req, res)=>{
    Doctor.findOne({_id: req.params.id})
    .then(doc=>{

        let filename = doc.file
        if(!isEmpty(req.files)){
            let file = req.files.file
            filename = Date.now() + '-' + file.name
            file.mv('./public/uploads/' + filename, err=>{
                if(err)console.log(err)
            })

            if(doc.file !== 'default.png'){
                fs.unlink('./public/uploads/' + doc.file, err=>{
                    if(err)console.log(err)
                })
            }
        }


        doc.name = req.body.name
        doc.email = req.body.email
        doc.field = req.body.field
        doc.intro = req.body.intro
        doc.file = filename
        doc.save()
        .then(updatedDoc=>{
            req.flash('success_msg', `${doc.name} has been updated successfully :)`)
            res.redirect('/admin/doctor')
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Doctor.findOne({_id: req.params.id})
    .then(doc=>{

        if(doc.file !== 'default.png'){
            fs.unlink('./public/uploads/' + doc.file, err=>{
                if(err)console.log(err)
            })
        }

        doc.delete()
        .then(response=>{
            req.flash('success_msg', `${response.name} has been deleted successfully :)`)
            res.redirect('/admin/doctor')
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(err))
})




// Multi Action on doctors
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Doctor.find({_id: req.body.checkboxes})
    .then(doctors=>{
        doctors.forEach(doctor=>{
            if(doctor.file !== 'default.png'){
                fs.unlink('./public/uploads/' + doctor.file, err=>{
                    if(err) console.log(err)
                })
            }
            doctor.delete()
            .then(response=>{
                req.flash('success_msg', `Doctors Deleted successfully :)`)
                res.redirect('/admin/doctor')
            })
            .catch(err=> console.log(`Can't delete due to ${err}`))
        })          
    })
     .catch(err=>console.log(err))    
})


module.exports = router