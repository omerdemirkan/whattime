import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: null,
    loading: true,
    accessToken: null
}

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTHENTICATION_SUCCESS:
            return {
                ...state,
                username: action.username,
                loading: false,
                accessToken: action.accessToken
            }
        case actionTypes.AUTHENTICATION_FAILURE:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}

export default authReducer;