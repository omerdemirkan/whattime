const router = require('express').Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const rateLimit = require("express-rate-limit");
 
// Maximum of 2 users registered in an hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 2 
});

// Maximum of 10 /login and /verify requests in 15 mins per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

function generateTemporaryToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3d'});
}

router.get('/register', registerLimiter, async (req, res) => {

    if (! req.body || !req.body.username || ! req.body.password) {
        return res.sendStatus(400);
    };

    // Usernames all lowercase and both usernames and passwords are without spaces.
    // Note that this validation is as a last resort, these are handled in the front-end, but just for extra security.
    const username = req.body.username.toLowerCase().replace(/\s/g, '');
    const password = req.body.password.replace(/\s/g, '');

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

router.get('/login', limiter, (req, res) => {
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

router.get('/verify', limiter, verify, (req, res) => {
    // refreshing user access:
    const accessToken = generateTemporaryToken({_id: req.user._id})
    res.json({accessToken: accessToken});
});


module.exports = router;