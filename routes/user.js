const router = require('express').Router();
const Survey = require('../models/survey');
const jwt = require('jsonwebtoken');

const nameTypeIsValid = require('../helper/nameTypeIsValid');

const rateLimit = require("express-rate-limit");
 
// Rate limiters
const strictLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 5
});

const mediumLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

// Helper method
const dateIsValid = (date) => {
    return date instanceof Date && !isNaN(date);
}

// Middleware
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

// Routes

router.get('/username', mediumLimiter, (req, res) => {
    const username = req.user.username;

    if (!username) return res.status(500).json({errors: ['Server error: Issue in extracting username from valid token']});

    res.json(username);
});

router.get('/surveys', mediumLimiter, (req, res) => {
    const userId = req.user._id;
    const skip = req.body.currentPosts;
    
    if (skip == null || typeof skip !== 'number') return res.status(400).json('currentPosts number required')

    Survey.find({creatorID: userId})
    .sort({createdAt: -1})
    .skip(skip)
    .limit(6)
    .exec((findSurveysError, surveys) => {
        if (findSurveysError) return res.json({errors: ['Error in finding surveys']});
        const hasMore = surveys.length === 6;

        res.json({
            surveys: surveys.slice(0, 6),
            hasMore: hasMore
        });
    });
});

router.get('/surveys/:id', mediumLimiter, (req, res) => {
    const surveyId = req.params.id

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError) return res.status(400).json({errors: ['No survey with this id found']});

        if (survey.creatorID !== req.user._id) return res.status(403).json({errors: ['Unauthorized']});

        res.json(survey);
    });
});

router.post('/surveys', strictLimiter, (req, res) => {
    const event = req.body.event.trim();
    const nameType = req.body.nameType;
    const date = new Date(req.body.date);

    if (!event || !date || !nameType) {
        return res.status(400).json('event, date, and nameType are required in the body of the request.'); 
    }
    
    if (!nameTypeIsValid(nameType)) {
        return res.status(400).json('Invalid nameType')
    }
    
    if(!dateIsValid(date)) {
        return res.status(400).json('Invalid date. Requires MM/DD/YYYY format')
    }

    if (date <= new Date()) {
        return res.status(400).json({errors: ['The event date must be after the current date']});
    }

    const newSurvey = new Survey({
        event: event,
        date: date,
        creatorID: req.user._id,
        creator: req.user.username,
        nameType: nameType,
        submitions: []
    });

    newSurvey.save(saveError => {
        if (saveError) return res.status(400).json({errors: ['Error in saving survey.']});

        res.json('Survey created!');
    });
})

module.exports = router;