const express  = require('express')
const app = express()
const router = express.Router()
const Contact = require('../../models/Contact')
const Department = require('../../models/Department')
const Doctor = require('../../models/Doctor')
const Appointment = require('../../models/Appointment')
const Research = require('../../models/Research')
const Media = require('../../models/Media')
const Service = require('../../models/Service')
const Faq = require('../../models/Faq')
const Testimony = require('../../models/Testimony')
const User = require('../../models/User')



router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{

    const promises = [
        User.countDocuments().exec(),
        Appointment.countDocuments().exec(),
        Doctor.countDocuments().exec(),
        Department.countDocuments().exec(),
        Research.countDocuments().exec(),
        Testimony.countDocuments().exec(),
        Service.countDocuments().exec(),
        Faq.countDocuments().exec(),
        Contact.countDocuments().exec(),
        Media.countDocuments().exec(),
    ];


    User.findOne({_id: req.user.id})
    .then(profile=>{
        Department.find()
        .then(depts=>{
            Doctor.find()
            .then(doctors=>{
                Promise.all(promises).then(([userCount, appointCount, doctorCount, deptCount, researchCount, testimonyCount, serviceCount, faqCount, contactCount, mediaCount])=>{
                    res.render('admin/index', {userCount: userCount, appointCount: appointCount, doctorCount: doctorCount, deptCount: deptCount, researchCount: researchCount, testimonyCount: testimonyCount, serviceCount: serviceCount, faqCount: faqCount, contactCount: contactCount, mediaCount: mediaCount, profile: profile, doctors: doctors, depts: depts})
                })
            })
            .catch(err=>console.log(err))
        })
         .catch(err=>console.log(err))   
       
    })
    .catch(err=>console.log)
   
  
})


module.exports = router;