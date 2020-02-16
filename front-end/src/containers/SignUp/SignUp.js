import React, {useState, useEffect} from 'react';
import classes from './SignUp.module.css';
import useDebounce from '../Hooks/useDebounce';
import axios from '../../axios';
import { Link } from 'react-router-dom'
import ScrollUpOnLoad from '../../components/ScrollUpOnLoad/ScrollUpOnLoad';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import {Input, IconButton} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityOffRoundedIcon from '@material-ui/icons/VisibilityOffRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

import Button from '../../components/UI/Button/Button';

function SignUp(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState({
        text: '',
        caseIsValid: false,
        lengthIsValid: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [usernameIsUnique, setUsernameIsUnique] = useState('unknown');

    const debouncedUsername = useDebounce(username, 800);
    const veryDebouncedUsername = useDebounce(username, 3000);


    async function fetchUsernameIsLoading() {
        setUsernameIsUnique('loading');
        axios.post('/auth/is-username-unique', {
            username: debouncedUsername
        })
        .then(res => {
            console.log(usernameIsUnique);
            setUsernameIsUnique(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }


    useEffect(() => {
        if (debouncedUsername.length >= 4) fetchUsernameIsLoading();
    }, [debouncedUsername]);

    function updateFormHandler(event, input) {
        switch(input) {
            case 'username':
                const updatedUsername = event.target.value;

                // Regex validation (uppercase, lowercase, dash, underscore)
                if (!updatedUsername.match(/^[a-zA-Z0-9_-]+$/) && updatedUsername !== '') break;

                if (updatedUsername.length <= 20 && updatedUsername.length !== username) {
                    setUsername(updatedUsername);
                    setUsernameIsUnique('unknown');
                }

                break;
            case 'password':
                const updatedPassword = event.target.value;

                if (!updatedPassword.match(/^[a-zA-Z0-9!@#\$%\^&]+$/) && updatedPassword !== '') break;

                if (updatedPassword.length <= 30) {
                    setPassword({
                        text: updatedPassword,
                        caseIsValid: new RegExp('[A-Z]').test(updatedPassword) && new RegExp('[a-z]').test(updatedPassword),
                        lengthIsValid: updatedPassword.length >= 8
                    });
                }
                break;
        }
    }

    function submitForm(event) {
        event.preventDefault();
        axios.post('/auth/register', {
            username: username,
            password: password.text
        })
        .then(res => {
            localStorage.setItem('accessToken', res.data.accessToken);
            props.onAuthenticationSuccess(username, res.data.accessToken);
            props.history.push('/create');
        })
        .catch(err => {
            console.log(err);
        });
    }

    let usernameMessage = null;

    const showUsernameLengthError = username === veryDebouncedUsername && username.length > 0 && username.length < 4;

    switch(usernameIsUnique) {
        case true:
            usernameMessage = <CheckRoundedIcon className={classes.UsernameLoader}/>;
            break;
        case false:
            usernameMessage = <span className={classes.UsernameMessage}>username taken</span>
            break;
        case 'unknown':
            if (showUsernameLengthError) {
                usernameMessage = <span className={classes.UsernameMessage}>username too short</span>
            }
            break;
        case 'loading':
            usernameMessage = <CircularProgress size={20} className={classes.UsernameLoader}/>
            break;
    }

    return <div className={classes.SignUp}>
        <ScrollUpOnLoad/>
        <h1 className={classes.Header}>Sign Up</h1>
        <form onSubmit={submitForm} className={classes.Form}>
            <div className={classes.InputGroup}>
                <div className={classes.InputHeader}>
                    <label className={classes.Label}>Username</label>
                    {usernameMessage}
                </div>
                
                <Input 
                type='text'
                label="Username"
                value={username}
                onChange={event => updateFormHandler(event, 'username')}
                className={classes.Input}
                error={usernameIsUnique === false || showUsernameLengthError}
                />
            </div>

            <div className={classes.InputGroup}>
                <div className={classes.InputHeader}>
                    <label className={classes.Label}>Password</label>
                    <IconButton
                    size="small"
                    className={classes.IconButton}>
                        {showPassword ? 
                            <VisibilityOffRoundedIcon onClick={() => setShowPassword(false)}/>
                        : 
                            <VisibilityRoundedIcon onClick={() => setShowPassword(true)}/>
                        }
                    </IconButton>
                </div>
                
                <Input 
                id="filled-password-input"
                type={showPassword ? 'text' : 'password'}
                label='Password'
                value={password.text}
                onChange={event => updateFormHandler(event, 'password')}
                className={classes.Input}
                />

                <div className={classes.PasswordFeedbackBox}>
                    <div className={classes.PasswordFeedback}>
                        <span style={password.lengthIsValid ? {backgroundColor: 'green'}: {backgroundColor: 'grey'}} className={classes.Dot}></span>
                        <span className={classes.PasswordFeedbackText}>Minimum of 8 characters</span>
                    </div>
                    <div className={classes.PasswordFeedback}>
                        <span style={password.caseIsValid ? {backgroundColor: 'green'}: {backgroundColor: 'grey'}} className={classes.Dot}></span>
                        <span className={classes.PasswordFeedbackText}>Capital and Lowercase letters</span>
                    </div>
                </div>

            </div>
            
            <Button
            disabled={usernameIsUnique !== true || !password.lengthIsValid || !password.caseIsValid} 
            type='submit'
            buttonClasses='Large Primary'
            style={{width: '100%'}}
            >SIGN UP</Button>
            
            <p className={classes.LinkText}>Already have an account? <Link to="/login" className={classes.Link}>Log In</Link></p>
        </form>
    </div>
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticationSuccess: (username, accessToken) => dispatch({type: actionTypes.AUTHENTICATION_SUCCESS, username: username, accessToken: accessToken})
    }
}

export default connect(null, mapDispatchToProps)(SignUp);
