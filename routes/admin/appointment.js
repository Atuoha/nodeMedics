const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const Doctor = require('../../models/Doctor')
const User = require('../../models/User')
const Department = require('../../models/Department')
const Appointment = require('../../models/Appointment')
const {isEmpty, uploadDir} = require('../../helpers/upload-helpers')
const fs = require('fs')

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    Appointment.find()
    .populate('user')
    .populate('department')
    .populate('doctor')
    .then(appointments=>{
        res.render('admin/appointment', {appointments: appointments})
    })
    .catch(err=>console.log(err))

})



router.get('/create', (req, res)=>{
    Doctor.find()
    .then(doctors=>{
        Department.find()
        .then(depts=>{
             res.render('admin/appointment/create', {doctors: doctors, depts: depts})
        })
        .catch(err=>console(`Error pulling depts ${err}`))
    })
    .catch(err=>console(`Error pulling doctors ${err}`))
})


// loggedInUser appointment
router.get('/:id', (req, res)=>{
    Appointment.find({user: req.user.id})
    .populate('user')
    .populate('department')
    .populate('doctor')
    .then(appointments=>{
        res.render('admin/appointment/loggedUser_Appointments', {appointments: appointments})
    })
    .catch(err=>console.log(err))

})


//all cancelled appointments
router.get('/cancelled', (req, res)=>{
    Appointment.find()
    .populate('user')
    .populate('department')
    .populate('doctor')
    .then(appointments=>{
        res.render('admin/appointment/cancelled', {appointments: appointments})
    })
    .catch(err=>console.log(err))

})


// loggedInUser cancelled appointments
router.get('/cancelled/:id', (req, res)=>{
    Appointment.find({user: req.user.id})
    .populate('user')
    .populate('department')
    .populate('doctor')
    .then(appointments=>{
        res.render('admin/appointment/loggedUser_CancelledAppoints', {appointments: appointments})
    })
    .catch(err=>console.log(err))

})



// displaying single appointment
router.get('/show/:id', (req, res)=>{

    Appointment.findOne({_id: req.params.id})
    .populate('user')
    .populate('department')
    .populate('doctor')
    .then(appointment=>{
       res.render('admin/appointment/show', {appointment: appointment})
    })
    .catch(err=>console.log(err))
})



// edit page of a single appointment
router.get('/edit/:id', (req, res)=>{

    Appointment.findOne({_id: req.params.id})
    .then(appointment=>{
        Doctor.find()
        .then(doctors=>{
            Department.find()
            .then(depts=>{
                res.render('admin/appointment/edit', {appointment: appointment, doctors: doctors, depts: depts})
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})



// creating an appointment
router.post('/create', (req, res)=>{
    const newAppoint = new Appointment

    newAppoint.user = req.user.id
    newAppoint.doctor = req.body.doctor
    newAppoint.department = req.body.department
    newAppoint.date = req.body.date
    newAppoint.message = req.body.message
    newAppoint.save()
    .then(savedAppoint=>{
        req.flash('success_msg', 'Appointment created successfully :)')
        if(req.user.role === 'Admin'){
            res.redirect('/admin/appointment')
        }else{
         res.redirect(`/admin/appointment/${req.user.id}`)
        }
    })
    .catch(err=>console.log(err))

})


// updating a single appointment
router.post('/update/:id', (req, res)=>{

    Appointment.findOne({_id: req.params.id})
    .then(appointment=>{
        appointment.date = req.body.date
        appointment.department = req.body.department
        appointment.doctor = req.body.doctor
        appointment.message = req.body.message
        appointment.save()
        .then(savedAppoint=>{
             req.flash('success_msg', 'Appointment has been updated successfully :)')
            if(req.user.role === 'Admin'){
                res.redirect('/admin/appointment')
            }else{
             res.redirect(`/admin/appointment/${req.user.id}`)
            }
        })
    })
    .catch(err=>console.log(err))
})





// deleting a single appointment
router.get('/delete/:id', (req, res)=>{

    Appointment.findOne({_id: req.params.id})
    .then(appointment=>{
        appointment.delete()
        .then(savedAppoint=>{
            req.flash('success_msg', 'Appointment has successfully been deleted :)')
            if(req.user.role === 'Admin'){
                res.redirect('/admin/appointment')
            }else{
             res.redirect(`/admin/appointment/${req.user.id}`)
            }
        })
    })
    .catch(err=>console.log(err))
})




// retrieving a cancelled appointment
router.get('/retrieve/:id', (req, res)=>{

    Appointment.findOne({_id: req.params.id})
    .then(appointment=>{
        appointment.status = 'Active'
        appointment.save()
        .then(savedAppoint=>{
            req.flash('success_msg', 'Appointment has successfully been retrieved')
            if(req.user.role === 'Admin'){
                res.redirect('/admin/appointment')
            }else{
             res.redirect(`/admin/appointment/${req.user.id}`)
            }
        })
    })
    .catch(err=>console.log(err))
})




// cancelling an appointment
router.get('/cancel/:id', (req, res)=>{

    Appointment.findOne({_id: req.params.id})
    .then(appointment=>{
        appointment.status = 'Unactive'
        appointment.save()
        .then(savedAppoint=>{
            req.flash('success_msg', 'Appointment has successfully been cancelled :)')
            if(req.user.role === 'Admin'){
                res.redirect('/admin/appointment/cancelled')
            }else{
             res.redirect(`/admin/appointment/cancelled/${req.user.id}`)
            }
        })
    })
    .catch(err=>console.log(err))
})



// Multi Action on Appointed that are not cancelled
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Appointment.find({_id: req.body.checkboxes})
    .then(appointments=>{
        appointments.forEach(appoint=>{
            if(req.body.action === 'cancel'){
                appoint.status = 'Unactive'
                appoint.save()
                .then(response=>{
                    req.flash('success_msg', 'Appointment(s) cancelled successfully')
                    if(req.user.role === 'Admin'){
                        res.redirect('/admin/appointment/cancelled')
                    }else{
                     res.redirect(`/admin/appointment/cancelled/${req.user.id}`)
                    }
                })
                .catch(err=>console.log(err))
            }else{
                appoint.delete()
                .then(response=>{
                    req.flash('success_msg', 'Appointment(s) deleted successfully')
                    if(req.user.role === 'Admin'){
                        res.redirect('/admin/appointment')
                    }else{
                     res.redirect(`/admin/appointment/${req.user.id}`)
                    }
                })
                .catch(err=>console.log(err)) 
            }
            
        })
            
    })
     .catch(err=>console.log(err))

    
})







// Multi Action on Appointed that are cancelled
router.post('/cancelled_multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Appointment.find({_id: req.body.checkboxes})
    .then(appointments=>{
        appointments.forEach(appoint=>{
            if(req.body.action === 'retrieve'){
                appoint.status = 'Active'
                appoint.save()
                .then(response=>{
                    req.flash('success_msg', 'Appointment(s) retrieved successfully')
                    res.redirect('/admin/appointment')
                })
                .catch(err=>console.log(err))
            }else{
                appoint.delete()
                .then(response=>{
                    req.flash('success_msg', 'Appointment(s) deleted successfully')
                    res.redirect("back")
                })
                .catch(err=>console.log(err)) 
            }
            
        })
            
    })
     .catch(err=>console.log(err))

    
})


module.exports = router;