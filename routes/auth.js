const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


router.get('/create', (req, res) => {

    const isGuest = req.body.isGuest;
    const username = isGuest ? null : req.body.username;
    const password = isGuest ? null : req.body.password;

    // Guests don't have usernames and passwords.

    if (isGuest) {

        const guest = new User({
            isGuest: true
        });

        guest.save(saveError => {
            if (saveError) res.json('error in saving guest:', saveError);
            
            const accessToken = jwt.sign({isGuest: true}, process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken});
        });

    } else if (username && password) {

        bcrypt.hash(password, Number(process.env.SALT_ROUNDS), (hashError, hash) => {
            if (hashError) res.json('error hashing password:', hashError);

            const newUser = new User({
                isGuest: true,
                username: username,
                hash: hash
            });

            newUser.save(saveError => {
                if (saveError) res.json('error in saving user.', saveError);
                
                const accessToken = jwt.sign({isGuest: true}, process.env.ACCESS_TOKEN_SECRET);
                res.json({user: newUser, accessToken: accessToken});
            });

        });

    } else {
        res.json('non-guest users require usernames and passwords');
    }
});


module.exports = router;