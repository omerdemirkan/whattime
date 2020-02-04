import * as actionTypes from '../actions/actionTypes';

const initialState = {
    timeframes: [],
    survey: null
}

const submitReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_TIMEFRAMES:
            return {
                ...state,
                timeframes: action.timeframes
            }
        case actionTypes.SET_SUBMIT_SURVEY:
            return {
                ...state,
                survey: action.survey
            }
        default: 
            return state;
    }
}

export default submitReducer;