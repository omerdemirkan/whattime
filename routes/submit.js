const router = require('express').Router();
const Survey = require('../models/survey');
const submitionIsValid = require('../helper/submitionIsValid');

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});

// Non-authorized routes used 

router.get('/:id', limiter, (req, res) => {
    const surveyId = req.params.id;

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError || !survey) return res.status(400).json('No survey with this id');

        if (survey.date <= new Date()) {
            return res.status(400).json({errors: ['The event date has passed.']})
        }

        res.json({
            event: survey.event,
            date: survey.date,
            creator: survey.creator,
            nameType: survey.nameType
        });
    });
});

router.post('/:id', limiter, (req, res) => {
    const surveyId = req.params.id;
    const submition = req.body.submition;

    if (!submition) {
        return res.status(400).json('Submition required in request body.')
    }

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError || !survey) return res.status(400).json('Could not find a survey with this id');

        if (survey.date <= new Date()) {
            return res.status(400).json({errors: ['The event date has passed.']})
        }

        if (!submitionIsValid(submition, survey.date)) {
            return res.status(400).json('Invalid submition (failed submitionIsValid).');
        }

        survey.submitions.push(submition);

        survey.save(saveSurveyError => {
            if (saveSurveyError) return res.status(400).json(`Invalid submition: ${saveSurveyError}`);

            res.json('Submition successful');
        });
    });
});

module.exports = router;