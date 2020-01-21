const router = require('express').Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateTemporaryToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}

router.get('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Guests don't have usernames and passwords.

    if (username && password) {

        bcrypt.hash(password, Number(process.env.SALT_ROUNDS), (hashError, hash) => {
            if (hashError) return res.json('error hashing password:', hashError);

            const newUser = new User({
                isGuest: false,
                username: username,
                hash: hash
            });

            newUser.save(saveError => {
                if (saveError) return res.json('error in saving user.', saveError);
                
                const accessToken = generateTemporaryToken({_id: newUser._id, isGuest: newUser.isGuest});
                res.json({accessToken: accessToken});
            });
        });
    } else {
        res.json('users require usernames and passwords');
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
                const accessToken = generateTemporaryToken({_id: user._id, isGuest: user.isGuest});
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
    // refreshing user access:
    const accessToken = generateTemporaryToken({_id: req.user._id, isGuest: isGuest})
    res.json({accessToken: accessToken});
});


module.exports = router;