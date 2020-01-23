const router = require('express').Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const rateLimit = require("express-rate-limit");
 
// Maximum of 2 users registered in a day per IP
const strictLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 2 
});

// Maximum of 10 /login and /verify requests in 15 mins per IP
const mediumLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

// Maximum of 50 /is-username-unique per 15 minutes
const laxLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
});

function generateTemporaryToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3d'});
}

router.get('/register', strictLimiter, async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    // Basic input validation
    if (!username || !password) {
        return res.status(400).json({errors: 'Username and password is required.'});
    } else if (typeof username !== 'string' || typeof username !== 'string') {
        return res.status(400).json({errors: 'Username and password must be strings.'});
    }

    // Usernames all lowercase and both usernames and passwords are without spaces.
    // Note that this validation is as a last resort, these are handled in the front-end, but just for extra security.
    username = req.body.username.toLowerCase().replace(/\s/g, '');
    password = req.body.password.replace(/\s/g, '');

    let errors = [];

    // Length validation
    if (username.length > 20 || username.length < 4) {
        errors.push('Usernames must be between 4 and 20 characters long');
    };

    if (password.length > 30 || password.length < 8) {
        errors.push('Passwords must be between 8 and 30 characters');
    };


    // Checking for unique username
    const duplicate = await User.findOne({username: username});
    
    if (duplicate) {
        errors.push('Username is taken');
    };

    if (errors.length !== 0) {
        return res.status(400).json({errors: errors});
    };


    const saltRounds = Number(process.env.SALT_ROUNDS);

    bcrypt.hash(password, saltRounds, (hashError, hash) => {
        if (hashError) return res.status(500).json({errors: "Network error: Can't in hashing password." + hashError});

        const newUser = new User({
            username: username,
            hash: hash
        });

        newUser.save(saveError => {
            if (saveError) return res.status(500).json({errors: 'Network Error: could not save user.' + saveError});
            
            const accessToken = generateTemporaryToken({_id: newUser._id, username: username});
            res.json({accessToken: accessToken});
        });
    });
});

router.get('/login', mediumLimiter, (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    // Basic input validation
    if (!username || !password) {
        return res.status(400).json({errors: 'Username and password is required.'});
    } else if (typeof username !== 'string' || typeof username !== 'string') {
        return res.status(400).json({errors: 'Username and password must be strings.'});
    }

    username = username.toLowerCase().replace(/\s/g, '');
    password = password.replace(/\s/g, '');

    User.findOne({username: username}, (findUserByNameError, user) => {
        if (findUserByNameError) return res.sendStatus(400);
        if (!user) return res.status(400).json({errors: 'Incorrect username or password'});

        bcrypt.compare(password, user.hash, (passwordError, passwordCorrect) => {
            if (passwordError) return res.status(500).json({errors: 'Error in checking password'})

            if (passwordCorrect) {
                const accessToken = generateTemporaryToken({_id: user._id, username: user.username});
                return res.json({accessToken: accessToken});
            }
            
            res.status(403).json({errors: 'Incorrect username or password'});
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

// Generates new authToken, setting a new expiration date.
// Sends username stored in token
router.get('/verify', mediumLimiter, verify, (req, res) => {
    const username = req.user.username;
    const userId = req.user._id;
    const accessToken = generateTemporaryToken({_id: userId, username: username})
    res.json({accessToken: accessToken, username: username});
});

router.get('/is-username-unique', laxLimiter, (req, res) => {
    if (!req.body.username || typeof req.body.username !== 'string') {
        return res.status(400).json({errors: 'Invalid username'});
    }

    const username = req.body.username.toLowerCase().replace(/\s/g, '');

    User.findOne({username: username}, (findUserError, user) => {
        if (findUserError) return res.json(false);

        const isUnique = user == null;
        res.json(isUnique);
    });
});


module.exports = router;