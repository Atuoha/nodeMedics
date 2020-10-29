const express = require('express')
const app = express()
const router = express.Router()
const faker = require('faker')
const Patient = require('../../models/Patient')
const fs = require('fs')
const {isEmpty} = require('../../helpers/upload-helpers')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    Patient.find()
    .then(patients=>{
        res.render('admin/patient', {patients: patients})
    })
    .catch(err=>console.log(err))
})

router.get('/create', (req, res)=>{
    res.render('admin/patient/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/patient/dummy')
})

router.get('/edit/:id', (req, res)=>{
    Patient.findOne({_id: req.params.id})
    .then(patient=>{
        res.render('admin/patient/edit', {patient: patient})
    })
    .catch(err=>console.log(err))
})



router.get('/show/:id', (req, res)=>{
    Patient.findOne({_id: req.params.id})
    .then(patient=>{
        res.render('admin/patient/show', {patient: patient})
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

    const newPatient = new Patient()
    newPatient.name = req.body.name
    newPatient.email = req.body.email
    newPatient.phone = req.body.phone
    newPatient.entry_date = req.body.entry_date
    newPatient.discharge_date = req.body.discharge_date
    newPatient.file = filename
    newPatient.note = req.body.note

   
    newPatient.save()
    .then(savedpatient=>{
        req.flash('success_msg', `${savedpatient.name} has been created as a patient successfully :)`)
        res.redirect('/admin/patient')
    })
    .catch(err=>console.log(err))
       
    
})


router.post('/dummy', (req, res)=>{
    for(let i = 0; i < req.body.number; i++){
        const newPatient = new Patient()
        newPatient.name = faker.name.firstName() + ' ' + faker.name.lastName()
        newPatient.email =  faker.internet.email()
        newPatient.phone =  '+234-000-0000-000'
        newPatient.entry_date = new Date()
        newPatient.discharge_date = new Date()
        newPatient.file = 'default.png'
        newPatient.note = faker.lorem.sentence()
    

        newPatient.save()
        .then(savedpatient=>{
            req.flash('success_msg', `${req.body.number} dummy patients has been created as patients successfully :)`)
            res.redirect('/admin/patient')
        })
        .catch(err=>console.log(err))
       
    }
})

router.post('/update/:id', (req, res)=>{
    Patient.findOne({_id: req.params.id})
    .then(patient=>{
        let filename = patient.file
        if(!isEmpty(req.files)){
            let file =  req.files.file
            filename = Date.now() + '-' + file.name
            file.mv('./public/uploads/' + filename, err=>{
                if(err)console.log(err)
            })

            if(patient.file !== 'default.png' && patient.file !== ''){
                fs.unlink('./public/uploads/' + patient.file, err=>{
                    if(err)console.log(`eRROR removing file: ${err}`)
                })
            }
           
        }

      
        patient.name = req.body.name
        patient.email = req.body.email
        patient.phone = req.body.phone
        patient.entry_date = req.body.entry_date
        patient.discharge_date = req.body.discharge_date
        patient.file = filename
        patient.note = req.body.note


        patient.save()
        .then(savedpatient=>{
            req.flash('success_msg', 'Update was successfully :)')
                res.redirect('/admin/patient')
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(`Can't find patient ${err}`))
})


router.get('/delete/:id', (req, res)=>{
    Patient.findOne({_id: req.params.id})
    .then(patient=>{

        if(patient.file !== 'default.png' && patient.file !== ''){
            fs.unlink('./public/uploads/' + patient.file, err=>{
                if(err)console.log(`eRROR removing file: ${err}`)
            })
        }

        patient.delete()
        .then(response=>{
            req.flash('success_msg', `${response.name} was successfully deleted :)`)
            res.redirect('/admin/patient')
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})





// Multi Action on patients
router.post('/multiaction', (req, res)=>{
    console.log(req.body.checkboxes)

    Patient.find({_id: req.body.checkboxes})
    .then(patients=>{
        patients.forEach(patient=>{
            if(req.body.action === 'discharged'){
                patient.status = 'Discharged'
                patient.save()
                .then(response=>{
                    req.flash('success_msg', 'patients updated successfully')
                        res.redirect('/admin/patient')
                })
                .catch(err=>console.log(err))
            }else if(req.body.action === 'active'){

                patient.status = 'Active'
                patient.save()
                .then(response=>{
                    req.flash('success_msg', 'patients updated successfully')
                        res.redirect('/admin/patient')
                })
                .catch(err=>console.log(err))

            }else{
                if(patient.file !== 'default.png'){
                    fs.unlink('./public/uploads/' + patient.file, err=>{
                        if(err)console.log(err)
                    })
                }
                patient.delete()
                .then(response=>{
                    req.flash('success_msg', 'patient(s) deleted successfully')
                        res.redirect('/admin/patient')
                })
                .catch(err=>console.log(err)) 
            }
            
        })
            
    })
     .catch(err=>console.log(err))

    
})


module.exports = router