const router = require('express').Router();
const Survey = require('../models/survey');
const submitionIsValid = require('../helper/submitionIsValid');

// Non-authorized routes used 

router.get('/:id', (req, res) => {
    const surveyId = req.params.id;

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError) return res.status(400).json('No survey with this id');

        res.json({
            event: survey.event,
            date: survey.date,
            creator: survey.creator,
            nameType: survey.nameType
        });
    });
});

router.post('/:id', (req, res) => {
    const surveyId = req.params.id;
    const submition = req.params.submition;

    if (!submitionIsValid(submition)) {
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