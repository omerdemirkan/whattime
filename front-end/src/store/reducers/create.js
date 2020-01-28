import * as actionTypes from '../actions/actionTypes';

const initialState = {
    selectedDate: new Date(),
    eventName: '',
    nameType: ''
}

const createReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.UPDATE_EVENT_NAME:
            return {
                ...state,
                eventName: action.eventName
            }
        case actionTypes.UPDATE_NAME_TYPE:
            return {
                ...state,
                nameType: action.nameType
            }
        case actionTypes.UPDATE_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.selectedDate
            }
        default: 
            return state;
    }
}

export default createReducer;