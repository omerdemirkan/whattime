import React, {useState, useEffect} from 'react';
import classes from './SignUp.module.css';
import useDebounce from '../Hooks/useDebounce';
import axios from '../../axios';

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
    const [password, setPassword] = useState('');
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
                    setPassword(updatedPassword);
                }
                break;
        }
    }

    function submitForm(event) {
        event.preventDefault();
        axios.post('/auth/register', {
            username: username,
            password: password
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

    switch(usernameIsUnique) {
        case true:
            usernameMessage = <CheckRoundedIcon className={classes.UsernameLoader}/>;
            break;
        case false:
            usernameMessage = <span className={classes.UsernameMessage}>username taken</span>
            break;
        case 'unknown':
            if (username === veryDebouncedUsername && username.length > 0 && username.length < 4) {
                usernameMessage = <span className={classes.UsernameMessage}>username too short</span>
            }
            break;
        case 'loading':
            usernameMessage = <CircularProgress size={20} className={classes.UsernameLoader}/>
            break;
    }


    return <div>
        <h1 className={classes.Header}>Sign Up</h1>
        <form onSubmit={submitForm} className={classes.Form}>
            <div className={classes.InputGroup}>
                <label>Username</label>
                {usernameMessage}
                <Input 
                type='text'
                label="Username"
                value={username}
                onChange={event => updateFormHandler(event, 'username')}
                className={classes.TextField}
                error={usernameIsUnique === false}
                />
            </div>

            <div className={classes.InputGroup}>
                <label>Password</label>
                <IconButton
                size="small"
                className={classes.IconButton}>
                    {showPassword ? 
                        <VisibilityOffRoundedIcon onClick={() => setShowPassword(false)}/>
                    : 
                        <VisibilityRoundedIcon onClick={() => setShowPassword(true)}/>
                    }
                </IconButton>
                <Input 
                id="filled-password-input"
                type={showPassword ? 'text' : 'password'}
                label='Password'
                value={password}
                onChange={event => updateFormHandler(event, 'password')}
                className={classes.TextField}
                />
            </div>
            
            <Button
            disabled={usernameIsUnique !== true || password.length < 8} 
            type='submit'
            buttonClasses='Medium Primary'
            style={{position: 'absolute', bottom: '0', right: '0'}}
            >SIGN UP</Button>
        </form>
    </div>
}

const mapStateToProps = state => {
    return {
        username: state.auth.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticationSuccess: (username, accessToken) => dispatch({type: actionTypes.AUTHENTICATION_SUCCESS, username: username, accessToken: accessToken})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
