import * as actionTypes from '../actions/actionTypes';

const initialState = {
    survey: null,
    loading: false
}

const inspectReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.LOAD_INSPECT_SURVEY_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_INSPECT_SURVEY_SUCCESS:
            return {
                ...state,
                survey: action.survey,
                loading: false
            }
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