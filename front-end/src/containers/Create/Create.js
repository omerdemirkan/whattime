import React from 'react';
import classes from './Create.module.css';

import AuthRequired from '../Auth/AuthRequired';
import Button from '../../components/UI/Button/Button';
import useDebounce from '../Hooks/useDebounce';
import ScrollUpOnLoad from '../../components/ScrollUpOnLoad/ScrollUpOnLoad';
import loadSurveysAsync from '../../store/actions/loadSurveys';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Purple from '../../components/ThemeProviders/Purple';

import axios from '../../axios';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

const floorDate = date => {
    date.setHours(0);
    date.setMinutes(0);
    return date;
}

function Create(props) {

    const setDateHandler = date => {
        props.onUpdateSelectedDate(floorDate(date));
    };

    const setEventNameHandler = event => {
        const newEventName = event.target.value;
        if (newEventName.length <= 30) {
            props.onUpdateEventName(newEventName);
        }
    }

    const setNameTypeHandler = event => {
        props.onUpdateNameType(event.target.value)
    }

    const postSurveyHandler = () => {
        const accessToken = props.accessToken;

        axios.post('/user/surveys', {
            event: props.eventName,
            nameType: props.nameType,
            date: props.selectedDate
        }, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })
        .then(res => {
            props.onResetCreate();
            props.history.push('/my-surveys/' + res.data.surveyId);
        })
        .catch(err => {
            console.log(err);
        });
    }

    const debouncedEventName = useDebounce(props.eventName, 3000);

    const showEventNameAlert = debouncedEventName !== '' && debouncedEventName === props.eventName && props.eventName.trim().length < 4;

    return <div className={classes.Create}>
        <AuthRequired history={props.history}/>
        <ScrollUpOnLoad/>
        <h1 className={classes.Header}>Create a Survey</h1>
        <div className={classes.MainBox}>
            <Purple>
                <div className={classes.InputGroup}>
                    <div className={classes.InputHeader}>
                        <label className={classes.Label}>Event</label>
                        {showEventNameAlert ?
                            <span className={classes.EventNameMessage}>too short!</span>
                        : null}
                    </div>

                    <Input 
                    id="standard-basic" 
                    value={props.eventName}
                    onChange={setEventNameHandler}
                    className={classes.Input}
                    autoComplete='off'
                    autoFocus={true}
                    error={showEventNameAlert}/>
                </div>
                
                {/* Special styling for following divs due to Icon button in KeyboardDatePicker */}
                <div className={classes.InputGroup} style={{marginTop: '-16px'}}>
                    <div style={{position: 'relative', top: '16px'}} className={classes.InputHeader}>
                        <label className={classes.Label}>Date</label>
                    </div>
                    
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{margin: '0'}}>
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        minDate={new Date()}
                        value={props.selectedDate}
                        onChange={setDateHandler}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        className={classes.Input}
                        />
                    </MuiPickersUtilsProvider>
                </div>

                <div className={classes.InputGroup}>
                    <div className={classes.InputHeader}>
                        <label className={classes.Label}>Identifier</label>
                    </div>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.nameType}
                    onChange={setNameTypeHandler}
                    className={classes.Input}>
                        <MenuItem value={'First Name'}>First Name</MenuItem>
                        <MenuItem value={'Full Name'}>Full Name</MenuItem>
                        <MenuItem value={'Alias'}>Alias</MenuItem>
                    </Select>
                </div>
            </Purple>
            

            
            <Button 
            onClick={postSurveyHandler}
            buttonClasses='Large'
            style={{width: '100%'}}
            disabled={props.eventName.length < 4 || props.nameType === ''}
            >Submit</Button>
        </div>
        
    </div>
}

const mapStateToProps = state => {
    return {
        nameType: state.create.nameType,
        eventName: state.create.eventName,
        selectedDate: state.create.selectedDate,
        accessToken: state.auth.accessToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateNameType: nameType => dispatch({type: actionTypes.UPDATE_NAME_TYPE, nameType: nameType}),
        onUpdateEventName: eventName => dispatch({type: actionTypes.UPDATE_EVENT_NAME, eventName: eventName}),
        onUpdateSelectedDate: selectedDate => dispatch({type: actionTypes.UPDATE_SELECTED_DATE, selectedDate: selectedDate}),
        onResetCreate: () => dispatch({type: actionTypes.RESET_CREATE})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
