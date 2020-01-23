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
    const surveyId = req.params.id

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError) return res.status(400).json('No survey with this id found');

        res.json(survey);
    });
});

router.post('/surveys', (req, res) => {
    const event = req.body.event.trim();
    const date = new Date(req.body.date);

    if (event == null || date == null) {
        return res.status(400).json('Event and date are required in the body of the request.'); 
    }

    if (date <= new Date()) {
        return res.status(400).json('The event date must be after the current date');
    }

    const newSurvey = new Survey({
        event: event,
        date: date,
        creatorID: req.user._id,
        creator: req.user.username,
        submitions: []
    });

    newSurvey.save(saveError => {
        if (saveError) return res.status(400).json('Error in saving survey.');

        res.json('Survey created!');
    });
})

module.exports = router;