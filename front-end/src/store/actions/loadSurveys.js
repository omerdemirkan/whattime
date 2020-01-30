import * as actionTypes from './actionTypes';

const loadSurveysAsync = (currentPosts, accessToken) => {
    return dispatch => {

    }
}

const loadSurveysStart = () => {
    return {type: actionTypes.LOAD_SURVEYS_START}
}

const loadSurveysSuccess = (surveys, hasMore) => {
    return {type: actionTypes.LOAD_SURVEYS_SUCCESS, surveys: surveys, hasMore: hasMore}
}