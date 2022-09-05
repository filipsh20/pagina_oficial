const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userInfo = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userInfo.findById(id);
    done(null, user);
});

passport.use('local.signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { email } = req.body;
    //verifications
    const validateEmail = email => /\S+@\S+/.test(email)
    const verifyEmail = await userInfo.findOne({ email: email });
    const verifyUser = await userInfo.findOne({ username: username });
    if (verifyUser) return done(null, false, req.flash('signupError', 'The username is already in use'));
    if (verifyEmail || !validateEmail(email)) return done(null, false, req.flash('signupError', 'The email is not empty'));
    //save user
    const NewUser = new userInfo();
    NewUser.username = username;
    NewUser.email = email;
    NewUser.password = NewUser.encryptPass(password);
    await NewUser.save();
    //verification email
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD
        }
    });
    await transport.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: NewUser.email, 
        subject: "Verification", 
        html: `<a href="${process.env.HEROKU || 'http://localhost:3000'}" </a>`,
    });
    return done(null, false, req.flash('signupSuccess', 'We have sent you a email with the account verification'));
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    //verifications
    const validateEmail = email => /\S+@\S+/.test(email)
    const verifyEmail = await userInfo.findOne({ email: email });
    if (!verifyEmail || !validateEmail(email)) return done(null, false, req.flash('signinError', 'The email is not avaible'));
    if (!verifyEmail.comparePass(password)) return done(null, false, req.flash('signinError', 'The password is incorrect'));
    return done(null, verifyEmail);
}));
