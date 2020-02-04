import * as actionTypes from '../actions/actionTypes';

const initialState = {
    modalMessage: null,
    snackbarMessage: null
}

const notificationReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.OPEN_MODAL:
            return {
                ...state,
                modalMessage: action.message
            }
        case actionTypes.CLOSE_MODAL:
            return {
                ...state,
                modalMessage: null
            }
        case actionTypes.OPEN_SNACKBAR:
            return {
                ...state,
                snackbarMessage: action.message
            }
        case actionTypes.CLOSE_SNACKBAR:
            return {
                ...state,
                snackbarMessage: null
            }
        default:
            return state;
    }
}

export default notificationReducer;