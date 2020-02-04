import * as actionTypes from '../actions/actionTypes';

const initialState = {
    modalOpen: false,
    snackbarOpen: false,
    modalMessage: null,
    snackbarMessage: null
}

const notificationReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.OPEN_MODAL:
            return {
                ...state,
                modalMessage: action.message,
                modalOpen: true
            }
        case actionTypes.CLOSE_MODAL:
            return {
                ...state,
                modalOpen: false
            }
        case actionTypes.OPEN_SNACKBAR:
            return {
                ...state,
                snackbarMessage: action.message,
                snackbarOpen: true
            }
        case actionTypes.CLOSE_SNACKBAR:
            return {
                ...state,
                snackbarOpen: false
            }
        default:
            return state;
    }
}

export default notificationReducer;