const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port =  1111 || process.env.Port
const path = require('path')
const handlebars = require('express-handlebars')
const Handlebars = require('Handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const upload = require('express-fileupload')



mongoose.connect('mongodb://localhost:27017/nodeMedics',{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(db=>{
        console.log('connected')
    })
    .catch(err=> console.log(err))

app.use(express.static(path.join(__dirname, 'public')))  // loading static files

const {select, generate_date, ifeq} = require('./helpers/handlebars-helpers')

//handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        helpers:{select: select, generate_date: generate_date, ifeq: ifeq},
        partialsDir: path.join(__dirname, "views/layouts/partials"),
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    
    }
    
))


//setting handlebars
app.set('view engine', 'handlebars')


//setting bodyParsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


//setting flash
app.use(flash())



// Session Middleware
app.use(session({
    secret: 'tonyAtuoha',
    resave: true,
    saveUninitialized: true
}))

//passport inits
app.use(passport.initialize())
app.use(passport.session())

// setting local variables
app.use( (req, res, next)=>{
    res.locals.error_msg = req.flash('error_msg')
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error = req.flash('error')
    res.locals.loggedUser = req.user || null

    next()
})


//setting upload
app.use(upload())


//home router
const home = require('./routes/home/main')
app.use('/', home)


//admin router
const admin = require('./routes/admin/main')
app.use('/admin', admin)


// admin appointment
const appointment = require('./routes/admin/appointment')
app.use('/admin/appointment', appointment)


//admin department
const department = require('./routes/admin/department')
app.use('/admin/department', department)


//admin doctor
const doctor = require('./routes/admin/doctor')
app.use('/admin/doctor', doctor)


//admin users
const users = require('./routes/admin/user')
app.use('/admin/users', users)


//admin users
const labs = require('./routes/admin/research')
app.use('/admin/labs', labs)


//admin service
const service = require('./routes/admin/service')
app.use('/admin/service', service)


//admin contact
const contact = require('./routes/admin/contact')
app.use('/admin/contact', contact)


//admin media
const media = require('./routes/admin/media')
app.use('/admin/media', media)


//admin testimony
const testimony = require('./routes/admin/testimony')
app.use('/admin/testimony', testimony)


//admin faq
const faq = require('./routes/admin/faq')
app.use('/admin/faq', faq)



app.listen(port, ()=>{
    console.log('Listening...')
})

