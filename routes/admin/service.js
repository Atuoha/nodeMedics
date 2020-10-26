const express =  require('express')
const app = express()
const router = express.Router()
const Service = require('../../models/Service')
const faker = require('faker')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


router.get('/', (req, res)=>{
    Service.find()
    .then(services=>{
        res.render('admin/our_services', {services: services})
    })
    .catch(err=>console.log(err))
})

router.get('/create', (req, res)=>{
    res.render('admin/our_services/create')
})


router.get('/dummy', (req, res)=>{
        res.render('admin/our_services/dummy')
})


router.get('/edit/:id', (req, res)=>{
    Service.findOne({_id: req.params.id})
    .then(service=>{
        res.render('admin/our_services/edit', {service: service})
    })
    .catch(err=>console.log(err))
})

router.post('/create', (req, res)=>{
    const newService = new Service()
    newService.name = req.body.name
    newService.font = req.body.font
    newService.content = req.body.content
    newService.save()
    .then(savedService=>{
        req.flash('success_msg', `${savedService.name} has been created successfully :)`)
        res.redirect('/admin/service')
    })
    .catch(err=>console.log)

})


router.post('/dummy', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        const newService = new Service()
        newService.name = faker.name.title()
        newService.font = 'ambulance'
        newService.content = faker.lorem.sentence()
        newService.save()
        .then(savedService=>{
            req.flash('success_msg', `${req.body.number} dummy services has been created successfully :)`)
            res.redirect('/admin/service')
        })
        .catch(err=>console.log)
        }
})


router.post('/update/:id', (req, res)=>{
    Service.findOne({_id: req.params.id})
    .then(service=>{
        service.name = req.body.name
        service.font = req.body.font
        service.content = req.body.content
        service.save()
        .then(savedService=>{
            req.flash('success_msg', `${service.name} has been updated successfully :)`)
            res.redirect('/admin/service')
        })
        .catch(err=>console.log)
    })
    .catch(err=>console.log)
})


router.get('/delete/:id', (req, res)=>{
    Service.findOne({_id: req.params.id})
    .then(service=>{
        service.delete()
        .then(response=>{
            req.flash('success_msg', `${service.name} has been deleted successfully :)`)
            res.redirect('/admin/service')
        })
        .catch(err=>console.log)
    })
    .catch(err=>console.log)
})


module.exports = router