var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
//hashing password
var bcrypt = require('bcryptjs');
//validation using joi
var Joi = require('joi');
const { registerValidation, loginValidation } = require('./models/validation');
//user model
var Users = require('./models/user');


router.get('/signup', function (req, res) {
    res.render('./public/signup.html', { msg: 'Just Signup now and start.' });
});


router.post('/signup', async function (req, res) {

    const { error } = await registerValidation(req.body);
    if (error) {
        res.render('./public/signup.html', { msg: error.details[0].message });
        
    }
    else {
        //email exist check
        const emailExists = await Users.findOne({ Eid: req.body.Eid });
        if (emailExists) return res.status(400).send('email already exists');

        // //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new Users({
            Eid: req.body.Eid,
            password: hashedPassword,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone

        });
        try {
            newUser.save(() => {

                console.log('1 into post signup page(protected))');
                // Users.find(function (err, response) {
                //     res.json(response);
                // });

                req.session.user = newUser;
                res.redirect('/auth/logged');
            })


        }
        catch (err) {
            res.status(400).send(err);
        }
    }

});

function checkSignIn(req, res, next) {
    console.log('3 checkSignIn');


    if (req.session.user) {
        console.log('3.1 done S');
        next();
    }
    else {
        var err = new Error("Not logged in!");
        console.log(req.session.user, "3.2 Not logged in!");
        next(err);                                          //Error, trying to access unauthorized page!
    }

}

router.get('/logged',checkSignIn , function (req, res) {
    console.log('4 final render')
    res.render('./public/logged.html', { id: 'logged' });
});

router.use('/logged', function (err, req, res, next) {
    console.log('2 mw err');
    if (req.session.user) {
        console.log('3.1 done S');
        next();
    }
    else {
        var err = new Error("Not logged in!");
        console.log(req.session.user, "3.2 Not logged in!");
        //Error, trying to access unauthorized page!
        //User should be authenticated! Redirect him to log in.
        res.redirect('/auth/login');
    }

});

router.get('/login', function (req, res) {
    res.render('./public/login.html', { msg: "Welcome" });
});

router.post('/login', async function (req, res) {

    const { error } = await loginValidation(req.body);
    if (error) {
        res.render('./public/login.html', { msg: error.details[0].message });
        
    }
    else {

        Users.findOne({ Eid: req.body.Eid }).then(user => {
            if (user) {
                // const validPass = bcrypt.compare(req.body.password, user.password);
                bcrypt.compare(req.body.password, user.password)
                .then(validPass=>{
                    
                    console.log(validPass,'vp')
                    if (!validPass) {
                        res.status(400)
                        res.render('./public/login.html', { msg: 'invalid password' });
                    }
                    else {
                        try {
                            req.session.user = user;
                            // console.log(user);
                            
                            res.redirect('/auth/logged');
    
    
                        } catch (err) {
                            res.send(err)
                        }
                    }
                })

            }
            else {

                res.render('./public/login.html', { msg: "incorrect email" });

            }
        })
    }
});


router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/auth/login');
});




module.exports = router;





