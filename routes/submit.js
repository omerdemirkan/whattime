const router = require('express').Router();
const Survey = require('../models/survey');
const submissionIsValid = require('../helper/submissionIsValid');

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
            nameType: survey.nameType,
            submissionIds: survey.submissions.map(submission => submission._id)
        });
    });
});

router.post('/:id', limiter, (req, res) => {
    const surveyId = req.params.id;
    const submission = req.body.submission;

    if (!submission) {
        console.log('Submission required in request body.');
        return res.status(400).json('Submission required in request body.')
    }

    Survey.findById(surveyId, (findSurveyError, survey) => {
        if (findSurveyError || !survey) return res.status(400).json('Could not find a survey with this id');

        if (survey.date <= new Date()) {
            console.log('The event date has passed.')
            return res.status(400).json({errors: ['The event date has passed.']})
        }

        if (!submissionIsValid(submission, survey.date)) {
            console.log('submission not valid');
            return res.status(400).json('Invalid submission (failed submissionIsValid).');
        }

        survey.submissions.push(submission);

        survey.save(saveSurveyError => {
            if (saveSurveyError) return res.status(400).json(`Invalid submission: ${saveSurveyError}`);
            const submissionId = survey.submissions[survey.submissions.length - 1]._id;
            res.json(submissionId);
        });
    });
});

module.exports = router;