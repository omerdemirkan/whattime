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

module.exports = router;