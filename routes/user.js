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

router.use(verify);

// router.get('/', (req, res) => {
//     const userId = req.user._id;

//     User.findById(userId, (findUserError, user) => {
//         if (findUserError || !user) return res.sendStatus(400);

//         res.json({
//             username: user.username
//         });
//     });
// });

router.get('/username', (req, res) => {
    const userId = req.user._id;

    User.findById(userId, (findUserError, user) => {
        if (findUserError || !user) return res.sendStatus(400);

        res.json(user.username);
    });
});

router.get('/surveys', (req, res) => {
    const userId = req.user._id;

    Survey.find({creatorID: userId}, (findSurveysError, surveys) => {
        if (findSurveysError) return res.json('Error in finding surveys');

        res.json(surveys);
    });
});

router.get('/surveys/:id', (req, res) => {
    const userId = req.user._id;
});

router.post('/surveys', (req, res) => {
    const event = req.body.event;

    if (event == null) {
        return res.status(400).json('No event found in request body.'); 
    }

    const newSurvey = new Survey({
        event: event,
        creatorID: req.user._id,
        submitions: []
    });

    newSurvey.save(saveError => {
        if (saveError) return res.status(400).json('Error in saving survey.');

        res.json('Survey created!');
    });
})

module.exports = router;