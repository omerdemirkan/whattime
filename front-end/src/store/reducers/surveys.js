import * as actionTypes from '../actions/actionTypes';

const initialState = {
    surveys: []
}

const surveysReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_SURVEYS:
            return {
                ...state,
                surveys: state.surveys.concat(action.surveys)
            }
        default:
            return state;
    }
}

export default surveysReducer;