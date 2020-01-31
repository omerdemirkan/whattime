import * as actionTypes from '../actions/actionTypes';

const initialState = {
    timeframes: [],
    survey: null
}

const submitReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_TIMEFRAME:
            let newTimeframes = [...state.timeframes].push(action.timeframe);
            return {
                ...state,
                timeframes: newTimeframes
            }
        case actionTypes.REMOVE_TIMEFRAME:
            return state;
        case actionTypes.SET_SURVEY:
            return {
                ...state,
                survey: action.survey
            }
        default: 
            return state;
    }
}

export default submitReducer;