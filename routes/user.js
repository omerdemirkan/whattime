const router = require('express').Router();
const User = require('../models/user');
const Survey = require('../models/survey');
const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (token == null) return res.status(401).json('Token not found in request header');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (tokenError, user) => {
        if (tokenError) return res.status(403).json('Token unauthorized');

        req.user = user;
        next()
    });
};

router.get('/', verify, (req, res) => {
    const userId = req.user._id;

    User.findById(userId, (findUserError, user) => {
        if (findUserError || !user) return res.sendStatus(400);

        res.json({
            username: user.username,
            surveys: user.surveys
        });
    });
});

router.get('/username', verify, (req, res) => {
    const userId = req.user._id;

    User.findById(userId, (findUserError, user) => {
        if (findUserError || !user) return res.sendStatus(400);

        res.json(user.username);
    });
});

router.get('/surveys', verify, (req, res) => {
    const userId = req.user._id;

    User.findById(userId, (findUserError, user) => {
        if (findUserError || !user) return res.sendStatus(400);

        res.json(user.surveys);
    });
});

router.post('/surveys', verify, (req, res) => {
    const userId = req.user._id;

    const event = req.body.event;

    if (!event) {
        return res.status(400).json('No event name found in the request body.');
    }

    
})

module.exports = router;