const router = require('express').Router();
const Survey = require('../models/survey');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/:id', (req, res) => {
    const surveyId = req.params.id;

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError) return res.status(400).json('No survey with this id');

        res.json({
            event: survey.event,
            date: survey.date
        });
    });
});

router.post('/:id', (req, res) => {
    const surveyId = req.params.id;
    const submition = req.params.submition;

    if (!submition) {
        return res.status(400).json('request needs a substitution property');
    }

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError) return res.status(400).json('No survey with this id');

        survey.submitions.push(submition);

        survey.save(saveSurveyError => {
            if (saveSurveyError) return res.status(400).json('Invalid submition');

            res.json('Submition successful');
        });
    });
});

module.exports = router;