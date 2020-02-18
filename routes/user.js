const router = require('express').Router();
const Survey = require('../models/survey');
const jwt = require('jsonwebtoken');

const nameTypeIsValid = require('../helper/nameTypeIsValid');

const rateLimit = require("express-rate-limit");
 
// Rate limiters
const strictLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 10
}); 

const mediumLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
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
        next();
    });
};

router.use(verify);

// Routes

router.get('/surveys', mediumLimiter, (req, res) => {
    const userId = req.user._id;
    const skip = Number(req.headers['currentposts']);
    
    if (typeof skip !== 'number' || typeof skip !== 'number') return res.status(400).json('currentPosts number required')

    Survey.find({creatorID: userId})
    .sort({createdAt: -1})
    .skip(skip)
    .limit(6)
    .exec((findSurveysError, surveys) => {
        if (findSurveysError) return res.json({errors: ['Error in finding surveys']});
        const hasMore = surveys.length === 6;

        res.json({
            surveys: surveys.slice(0, 5),
            hasMore: hasMore
        });
    });
});

router.post('/surveys', strictLimiter, (req, res) => {
    const event = req.body.event.trim();
    const nameType = req.body.nameType;
    const date = new Date(req.body.date);

    if (!event || !date || !nameType) {
        console.log('event, date, and nameType are required in the body of the request.');
        return res.status(400).json('event, date, and nameType are required in the body of the request.'); 
    }
    
    if (!nameTypeIsValid(nameType)) {
        console.log('Invalid nameType');
        return res.status(400).json('Invalid nameType')
    }
    
    if(!dateIsValid(date) || date <= new Date()) {
        console.log('Invalid date.');
        return res.status(400).json('Invalid date.')
    }

    const newSurvey = new Survey({
        event: event,
        date: date.getTime(),
        creatorID: req.user._id,
        creator: req.user.username,
        nameType: nameType,
        submissions: []
    });

    newSurvey.save((saveError, savedSurvey) => {
        if (saveError) return res.status(400).json({errors: ['Error in saving survey.']});

        res.json({surveyId: savedSurvey._id});
    });
});

router.delete('/surveys', strictLimiter, (req, res) => {
    const userId = req.user._id;

    Survey.deleteMany({creatorID: userId}, err => {
        if (err) return res.status(400).json('No surveys to be deleted.');

        res.json('Surveys successfully deleted.');
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

router.patch('/surveys/:id', mediumLimiter, (req, res) => {
    const surveyId = req.params.id;
    const event = req.body.event;
    const nameType = req.body.nameType;
    const date = new Date(req.body.date);

    if (!event && !nameType && !date) {
        res.status(400).json('No attribute to change.')
    }

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError || !survey) return res.status(400).json('Survey not found');

        if (nameType && nameTypeIsValid(nameType)) {
            survey.nameType = nameType;
        }

        if (event) {
            survey.nameType = nameType;
        }

        if (date) {
            survey.date = date;
        }

        if (date && survey.submissions.length !== 0) {
            survey.submissions = []
        }

        survey.save(saveSurveyError => {
            if (saveSurveyError) return res.status(400).json('Invalid request');

            res.json('Survey successfully updated');
        });
    });
});

router.delete('/surveys/:id', mediumLimiter, (req, res) => {
    const surveyId = req.params.id;

    Survey.deleteOne({_id: surveyId}, (findSurveyError) => {
        if (findSurveyError) return res.status(400).json('Survey not found.')

        res.json('Survey successfully deleted.');
    });
});

router.delete('/surveys/:surveyId/:submissionId', mediumLimiter, (req, res) => {
    const surveyId = req.params.surveyId;
    const submissionId = req.params.submissionId;

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError || !survey) return res.status(400).json('Survey not found.');

        try {
            const initialNumSubmissions = survey.submissions.length;

            survey.submissions = survey.submissions.filter(submission => {
                return submission._id.toString() !== submissionId;
            })

            if (initialNumSubmissions === survey.submissions.length) {
                return res.status(400).json('Submission not found.');
            }

            survey.save(saveError => {
                if (saveError) return res.status(500).json('Error in saving survey.');

                return res.json('Successfully deleted');
            });
        }
        catch(err) {
            res.status(500).json('Network error')
        }
    });
});

module.exports = router;