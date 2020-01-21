const router = require('express').Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get('/register', (req, res) => {

    const isGuest = req.body.isGuest;
    const username = isGuest ? null : req.body.username;
    const password = isGuest ? null : req.body.password;

    // Guests don't have usernames and passwords.

    if (isGuest) {

        const guest = new User({
            isGuest: true
        });

        guest.save(saveError => {
            if (saveError) return res.json('error in saving guest:', saveError);
            
            const accessToken = jwt.sign({isGuest: true}, process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken});
        });

    } else if (username && password) {

        bcrypt.hash(password, Number(process.env.SALT_ROUNDS), (hashError, hash) => {
            if (hashError) return res.json('error hashing password:', hashError);

            const newUser = new User({
                isGuest: false,
                username: username,
                hash: hash
            });

            newUser.save(saveError => {
                if (saveError) return res.json('error in saving user.', saveError);
                
                const accessToken = jwt.sign({_id: newUser._id, isGuest: newUser.isGuest}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
                res.json({accessToken: accessToken});
            });

        });

    } else {
        res.json('non-guest users require usernames and passwords');
    }
});

router.get('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (findUserByNameError, user) => {
        if (findUserByNameError || !user) return res.sendStatus(401);

        bcrypt.compare(password, user.hash, (passwordError, passwordCorrect) => {
            if (passwordError) return res.json(401);

            if (passwordCorrect) {
                const accessToken = jwt.sign({_id: user._id, isGuest: user.isGuest}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
                res.json({accessToken: accessToken});
            }
        });
    }); 

});

// To check for a valid token on load:

const verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (tokenError, user) => {
        if (tokenError) return res.sendStatus(403);

        req.user = user;
        next()
    });
}

router.get('/verify', verify, (req, res) => {
    res.sendStatus(200)
});


module.exports = router;