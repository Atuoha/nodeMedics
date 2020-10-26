const express = require('express')
const app = express()
const router = express.Router()
const Media  = require('../../models/Media')
const {isEmpty} = require('../../helpers/upload-helpers')
const fs = require('fs')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/', (req, res)=>{
    Media.find()
    .then(medias=>{
        res.render('admin/media', {medias: medias})
    })
    .catch(err=>console.log(err))
})


router.post('/create', (req, res)=>{
    let filename = ''
    if(!isEmpty(req.files)){
        let file = req.files.file
        filename = Date.now() + '-' + file.name
        file.mv('./public/uploads/' + filename, err=>{
            if(err)console.log(err)
        })
    }

    let newMedia = new Media()
    newMedia.file = filename
    newMedia.save()
    .then(savedMedia=>{
        req.flash('success_msg', 'Media successfully uploaded')
        res.redirect('/admin/media')
    })
    .catch(err=>console.log(err))
})


router.get('/delete/:id', (req, res)=>{

    Media.findOne({_id: req.params.id})
    .then(media=>{
        fs.unlink('./public/uploads/' + media.file, err=>{
            if(err)console.log(err)
        })
        media.delete()
        .then(response=>{
            req.flash('success_msg', 'Media successfully trashed :)')   
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router