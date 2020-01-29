import * as actionTypes from '../actions/actionTypes';

const initialState = {
    surveys: []
}

const surveysReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.UPDATE_SURVEYS:
            return {
                ...state,
                surveys: action.surveys
            }
        default:
            return state;
    }
}

export default surveysReducer;