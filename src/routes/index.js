const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', isAuthenticated, (req, res, next) => {
    res.render('home', {csrfToken: req.csrfToken()});
})
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/',
    passReqToCallback: true
}));
router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    passReqToCallback: true
}));
router.get('/logout', (req, res, next) => {
    req.logout((e) => { return next(e) });
    res.redirect('/');
});
router.get('/dashboard', isntAuthenticated, (req, res, next) => {
    res.render('dashboard');
});
router.get('/profile', (req, res, next) => {
    res.render('profile');
})
//protection
function isntAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    }
    return next();
}

module.exports = router;