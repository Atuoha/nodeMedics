const express = require('express')
const app = express()
const router  = express.Router()
const faker = require('faker')
const Department = require('../../models/Department')
const {isEmpty, uploadDir} = require('../../helpers/upload-helpers')
const fs = require('fs')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Department.find()
    .then(departments=>{
         res.render('admin/department', {departments: departments})
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('admin/department/create')
})


router.get('/dummy', (req, res)=>{
    res.render('admin/department/dummy')
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

    const newDept  = new Department()
    newDept.name = req.body.name
    newDept.intro = req.body.intro
    newDept.content = req.body.content
    newDept.tag = req.body.tag
    newDept.file = filename
    newDept.date = new Date()
    newDept.save()
    .then(savedDept=>{
        req.flash('success_msg', 'Department registered successfully :)')
        res.redirect('/admin/department')
    })
    .catch(err=>console.log(err))
    
})


router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){

        const newDept = new Department()
        newDept.name = faker.name.title()
        newDept.content = faker.lorem.sentence()
        newDept.intro = faker.lorem.sentence()
        newDept.tag = faker.random.word()
        newDept.file = 'img_place.png'
        newDept.date = new Date()
        newDept.save()
        .then(savedDept=>{
            req.flash('success_msg', `${req.body.number} Dummy Departments registered successfully :)`)
            res.redirect('/admin/department')
        })
        .catch(err=>console.log(err))
    }
   
})



router.get('/edit/:id', (req, res)=>{

    Department.findOne({_id: req.params.id})
    .then(dept=>{
        res.render('admin/department/edit', {dept: dept})
    })
    .catch(err=> console.log(err))
})


router.get('/show/:id', (req, res)=>{

    Department.findOne({_id: req.params.id})
    .then(dept=>{
        res.render('admin/department/show', {dept: dept})
    })
    .catch(err=> console.log(err))
})



router.post('/update/:id', (req, res)=>{

    Department.findOne({_id: req.params.id})
    .then(dept=>{

        let filename = dept.file
        if(!isEmpty(req.files)){
            let file = req.files.file
            filename =  Date.now() + '-' + file.name
            let dirUpload = './public/uploads/'
            file.mv(dirUpload + filename, err=>{
                if(err) console.log(err)
            })

            if(dept.file !== 'img_place.png'){
                fs.unlink('./public/uploads/' + dept.file, err=>{
                    if(err) console.log(err)
                })
            }
        }

        dept.name = req.body.name
        dept.tag = req.body.tag
        dept.intro = req.body.intro
        dept.content = req.body.content
        dept.file = filename

        dept.save()
        .then(response=>{
            req.flash('success_msg', `${dept.name} has been updated successfully :)`)
            res.redirect('/admin/department')
        })

    })
    .catch(err=> console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Department.findOne({_id: req.params.id})
    .then(dept=>{
        if(dept.file !== 'img_place.png'){
            fs.unlink('./public/uploads/' + dept.file, err=>{
                if(err) console.log(err)
            })
        }
        dept.delete()
        .then(response=>{
            req.flash('success_msg', `${response.name} Department Deleted successfully :)`)
            res.redirect('/admin/department')
        })
        .catch(err=> console.log(`Can't delete due to ${err}`))
    })
    .catch(err=> console.log(err))
})




// Multi Action on departments
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Department.find({_id: req.body.checkboxes})
    .then(depts=>{
        depts.forEach(dept=>{
            if(dept.file !== 'img_place.png'){
                fs.unlink('./public/uploads/' + dept.file, err=>{
                    if(err) console.log(err)
                })
            }
            dept.delete()
            .then(response=>{
                req.flash('success_msg', `Departments Deleted successfully :)`)
                res.redirect('/admin/department')
            })
            .catch(err=> console.log(`Can't delete due to ${err}`))
        })          
    })
     .catch(err=>console.log(err))    
})



module.exports = router