import React, {useState} from 'react';
import classes from './Login.module.css';
import axios from '../../axios';

import Input from '@material-ui/core/Input';
import Button from '../../components/UI/Button/Button';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

function Login(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function submitForm(event) {
        event.preventDefault();
        axios.post('/auth/login', {
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

    function updateFormHandler(event, input) {
        switch(input) {
            case 'username':
                const updatedUsername = event.target.value;

                // Regex validation (uppercase, lowercase, dash, underscore)
                if (!updatedUsername.match(/^[a-zA-Z0-9_-]+$/) && updatedUsername !== '') break;

                if (updatedUsername.length <= 20 && updatedUsername.length !== username) {
                    setUsername(updatedUsername);
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

    return <div>
        <h1 className={classes.Header}>Log In</h1>
        <form onSubmit={submitForm} className={classes.Form}>
            <div className={classes.InputGroup}>
                <label>Username</label>
                <Input 
                type='text'
                label="Username"
                value={username}
                onChange={event => updateFormHandler(event, 'username')}
                className={classes.TextField}
                />
            </div>
            <div className={classes.InputGroup}>
                <label>Password</label>
                <Input 
                id="filled-password-input"
                type='password'
                label='Password'
                value={password}
                onChange={event => updateFormHandler(event, 'password')}
                className={classes.TextField}
                />
            </div>
            
            <Button
            disabled={password.length < 8} 
            type='submit'
            buttonClasses='Medium Primary'
            style={{position: 'absolute', bottom: '0', right: '0'}}
            >SIGN UP</Button>
        </form>
    </div>
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticationSuccess: (username, accessToken) => dispatch({type: actionTypes.AUTHENTICATION_SUCCESS, username: username, accessToken: accessToken})
    }
}

export default connect(null, mapDispatchToProps)(Login);
