const express = require('express')
const app = express()
const router  = express.Router()
const faker = require('faker')
const Research = require('../../models/Research')
const {isEmpty, uploadDir} = require('../../helpers/upload-helpers')
const fs = require('fs')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Research.find()
    .then(labs=>{
         res.render('admin/research_lab', {labs: labs})
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('admin/research_lab/create')
})


router.get('/dummy', (req, res)=>{
    res.render('admin/research_lab/dummy')
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

    const newLab  = new Research()
    newLab.name = req.body.name
    newLab.location = req.body.location
    newLab.date = req.body.date
    newLab.intro = req.body.intro
    newLab.content = req.body.content
    newLab.tag = req.body.tag
    newLab.file = filename
    newLab.save()
    .then(savedLab=>{
        req.flash('success_msg', `${savedLab.name} Research Lab registered successfully :)`)
        res.redirect('/admin/labs')
    })
    .catch(err=>console.log(err))
    
})


router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){

        const newLab = new Research()
        newLab.name = faker.name.title()
        newLab.location = faker.random.word()
        newLab.content = faker.lorem.sentence()
        newLab.intro = faker.lorem.sentence()
        newLab.tag = faker.random.word()
        newLab.file = 'img_place.png'
        newLab.date = new Date()
        newLab.save()
        .then(savedLab=>{
            req.flash('success_msg', `${req.body.number} Dummy Labs registered successfully :)`)
            res.redirect('/admin/labs')
        })
        .catch(err=>console.log(err))
    }
   
})



router.get('/edit/:id', (req, res)=>{

    Research.findOne({_id: req.params.id})
    .then(lab=>{
        res.render('admin/research_lab/edit', {lab: lab})
    })
    .catch(err=> console.log(err))
})


router.get('/show/:id', (req, res)=>{

    Research.findOne({_id: req.params.id})
    .then(lab=>{
        res.render('admin/research_lab/show', {lab: lab})
    })
    .catch(err=> console.log(err))
})



router.post('/update/:id', (req, res)=>{

    Research.findOne({_id: req.params.id})
    .then(lab=>{

        let filename = lab.file
        if(!isEmpty(req.files)){
            let file = req.files.file
            filename =  Date.now() + '-' + file.name
            let dirUpload = './public/uploads/'
            file.mv(dirUpload + filename, err=>{
                if(err) console.log(err)
            })

            if(lab.file !== 'img_place.png'){
                fs.unlink('./public/uploads/' + lab.file, err=>{
                    if(err) console.log(err)
                })
            }
        }

        lab.name = req.body.name
        lab.tag = req.body.tag
        lab.location = req.body.location
        lab.date = req.body.date
        lab.intro = req.body.intro
        lab.content = req.body.content
        lab.file = filename

        lab.save()
        .then(response=>{
            req.flash('success_msg', `${lab.name} has been updated successfully :)`)
            res.redirect('/admin/labs')
        })

    })
    .catch(err=> console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Research.findOne({_id: req.params.id})
    .then(lab=>{
        if(lab.file !== 'img_place.png'){
            fs.unlink('./public/uploads/' + lab.file, err=>{
                if(err) console.log(err)
            })
        }
        lab.delete()
        .then(response=>{
            req.flash('success_msg', `${response.name} Lab Deleted successfully :)`)
            res.redirect('/admin/labs')
        })
        .catch(err=> console.log(`Can't delete due to ${err}`))
    })
    .catch(err=> console.log(err))
})

module.exports = router