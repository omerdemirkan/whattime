const router = require('express').Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateTemporaryToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
}

router.get('/register', async (req, res) => {

    if (!req.body.username || ! req.body.password) {
        return res.sendStatus(400);
    };

    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    let errors = [];

    // Type validation
    if (typeof username !== 'string' || typeof password !== 'string') {
        errors.push('Usernames and passwords must be string values');
    };

    // Length validation
    if (username.length && (username.length > 20 || username.length < 4)) {
        errors.push('Usernames must be between 4 and 20 characters long');
    };

    if (password.length && (password.length > 30 || password.length < 8)) {
        errors.push('Passwords must be between 8 and 30 characters');
    };

    // Checking for unique username
    const duplicate = await User.findOne({username: username});
    
    if (duplicate) {
        errors.push('Username is taken');
    };

    if (errors.length !== 0) {
        return res.json({errors: errors});
    };

    bcrypt.hash(password, Number(process.env.SALT_ROUNDS), (hashError, hash) => {
        if (hashError) return res.json('error hashing password:', hashError);

        const newUser = new User({
            username: username,
            hash: hash
        });

        newUser.save(saveError => {
            if (saveError) return res.json('error in saving user.', saveError);
            
            const accessToken = generateTemporaryToken({_id: newUser._id});
            res.json({accessToken: accessToken});
        });
    });
    
});

router.get('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (findUserByNameError, user) => {
        if (findUserByNameError || !user) return res.sendStatus(401);

        bcrypt.compare(password, user.hash, (passwordError, passwordCorrect) => {
            if (passwordError) return res.json(401);

            if (passwordCorrect) {
                const accessToken = generateTemporaryToken({_id: user._id});
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
    const accessToken = generateTemporaryToken({_id: req.user._id})
    res.json({accessToken: accessToken});
});


module.exports = router;