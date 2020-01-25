import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: null,
    loading: true
}

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTHENTICATION_SUCCESS:
            return {
                ...state,
                username: action.username,
                loading: false
            }
        default:
            return state;
    }
}

export default authReducer;