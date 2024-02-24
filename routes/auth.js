const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const bcrypt = require('bcryptjs');

const { loginAuth, disauthorize } = require('../config/auth');
const User = require('../models/User');

router.get('/login', disauthorize, (req, res) => {
    res.render('login.pug', {
        successes : req.flash('success'),
        errors: req.flash('error')
    }); 
});

router.post('/login', disauthorize, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/register', disauthorize, (req, res) => {
    res.render('register', {
        successes: req.flash('success'),
        errors: req.flash('error')
    });
});

router.post('/register', disauthorize, async (req, res, next) => {
    const {username, email, password} = req.body;

    let queriedUser = await User.findOne({username});

    if(queriedUser) {
        req.flash('error', 'Username is already taken');
        return res.redirect('/auth/register');
    }

    queriedUser = await User.findOne({email});

    if(queriedUser) {
        req.flash('error', 'Email is already associated with another account');
        return res.redirect('/auth/register');
    }

    if(password.length < 8) {
        req.flash('error', 'Password must have atleast 8 characters');
        return res.redirect('/auth/register');
    }


    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hashPwd) {
            if(err) return next(err);

            const user = new User({
                username,
                email,
                password: hashPwd
            });

            await user.save();

            req.flash('success', 'Registered successfull. Please sign in.');
            res.redirect('/auth/login');
        });
    });
})

router.get('/logout', loginAuth, (req, res, next) => {
    req.logout(function(err) {
        if(err) return next(err);

        req.flash('success', 'Logged out successfully')
        res.redirect('/');
    });
});

module.exports = router;