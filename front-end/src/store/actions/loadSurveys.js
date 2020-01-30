import * as actionTypes from './actionTypes';
import axios from '../../axios';

const loadSurveysAsync = (accessToken, currentPosts) => {
    return dispatch => {
        dispatch(loadSurveysStart());

        axios.get('/user/surveys', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                currentPosts: currentPosts
            }
        })
        .then(res => {
            dispatch(loadSurveysSuccess(res.data.surveys, res.data.hasMore));
        })
        .catch(err => {
            console.log(err);
        });
    }
}

const loadSurveysStart = () => {
    return {type: actionTypes.LOAD_SURVEYS_START}
}

const loadSurveysSuccess = (surveys, hasMore) => {
    return {type: actionTypes.LOAD_SURVEYS_SUCCESS, surveys: surveys, hasMore: hasMore}
}

export default loadSurveysAsync;