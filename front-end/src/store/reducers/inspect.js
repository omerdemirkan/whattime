import * as actionTypes from '../actions/actionTypes';

const initialState = {
    survey: null
}

const inspectReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_INSPECT_SURVEY:
            return {
                ...state,
                survey: action.survey
            }
        default: 
            return state
    }
}

export default inspectReducer;