const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port =  1111 || process.env.Port
const path = require('path')
const handlebars = require('express-handlebars')
const Handlebars = require('Handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

mongoose.connect('mongodb://localhost:27017/nodeMedics',{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(db=>{
        console.log('connected')
    })
    .catch(err=> console.log(err))

app.use(express.static(path.join(__dirname, 'public')))  // loading static files


//handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        helpers:{},
        partialsDir: path.join(__dirname, "views/layouts/partials"),
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    
    }
    
))


//setting handlebars
app.set('view engine', 'handlebars')


//home router
const home = require('./routes/home/main')
app.use('/', home)

app.listen(port, ()=>{
    console.log('Listening...')
})

