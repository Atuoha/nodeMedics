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
}));

// setting local variables
app.use( (req, res, next)=>{
    res.locals.error_msg = req.flash('error_msg')
    res.locals.success_msg = req.flash('success_msg')

    next()
})


//home router
const home = require('./routes/home/main')
app.use('/', home)


//admin router
const admin = require('./routes/admin/main')
app.use('/admin', admin)


// admin reservtion
const appointment = require('./routes/admin/appointment')
app.use('/admin/appointment', appointment)


app.listen(port, ()=>{
    console.log('Listening...')
})

