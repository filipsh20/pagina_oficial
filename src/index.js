const MongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const engine = require('ejs-mate');
const csrf = require('csurf');
const path = require('path');
const cors = require('cors');

//inicializations
const app = express();
const client = require('./database');
require('./passport/auth');

//settings
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

//middlewars
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    credentials: true,
    origin: process.env.HEROKU || "*",
    methods: ['GET', 'POST'],
}));
app.use(session({
    secret: prooces.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: 'session-user',
    store: MongoStore.create({ clientPromise: client }),
    cookie: { secure: process.env.MODE === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
app.use(flash());
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

//messages
app.use((req, res, next) => {
    app.locals.signupSuccess = req.flash('signupSuccess');
    app.locals.signupError = req.flash('signupError');
    app.locals.signinError = req.flash('signinError');
    app.locals.csrfToken = req.csrfToken();
    next();
});

//avoid mongo injection
app.use(MongoSanitize());

//routes
app.use('/', require('./routes/index'));

//start server
app.listen(app.get('port'), () => {
    console.log("Servidor funcionando por puerto", app.get('port'));
});