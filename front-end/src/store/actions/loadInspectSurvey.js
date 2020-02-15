import * as actionTypes from './actionTypes';
import axios from '../../axios';

const loadInspectSurveyAsync = (accessToken, surveyId) => {
    return dispatch => {
        dispatch(loadInspectSurveyStart());

        axios.get('/user/surveys/' + surveyId, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })
        .then(res => {
            dispatch(loadInspectSurveySuccess(res.data));
        })
        .catch(err => {
            console.log(err);
        });
    }
}

const loadInspectSurveyStart = () => {
    return {type: actionTypes.LOAD_INSPECT_SURVEY_START}
}

const loadInspectSurveySuccess = (survey) => {
    return {type: actionTypes.LOAD_INSPECT_SURVEY_SUCCESS, survey: survey}
}

export default loadInspectSurveyAsync;