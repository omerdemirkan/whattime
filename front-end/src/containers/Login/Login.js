import React, {useState} from 'react';
import classes from './Login.module.css';
import axios from '../../axios';
import { Link } from 'react-router-dom'
import ScrollUpOnLoad from '../../components/ScrollUpOnLoad/ScrollUpOnLoad';


import Input from '@material-ui/core/Input';
import Button from '../../components/UI/Button/Button';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

function Login(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [wrongPasswordMessage, setWrongPasswordMessage] = useState(false);

    function submitForm(event) {
        event.preventDefault();
        axios.post('/auth/login', {
            username: username,
            password: password
        })
        .then(res => {
            localStorage.setItem('accessToken', res.data.accessToken);
            props.onAuthenticationSuccess(username, res.data.accessToken);
            props.history.push('/my-surveys');
        })
        .catch(err => {
            console.log(err);
            setWrongPasswordMessage(true);
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

    return <div className={classes.Login}>
        <ScrollUpOnLoad/>
        <h1 className={classes.Header}>Log In</h1>
        <form onSubmit={submitForm} className={classes.Form}>
            {wrongPasswordMessage ?
                <p className={classes.WrongPasswordMessage}>Invalid Username or Password</p>
            : null}
            <div className={classes.InputGroup}>
                <div className={classes.InputHeader}>
                    <label className={classes.Label}>Username</label>
                </div>
                
                <Input 
                type='text'
                label="Username"
                value={username}
                onChange={event => updateFormHandler(event, 'username')}
                className={classes.Input}
                />
            </div>
            <div className={classes.InputGroup}>
            <div className={classes.InputHeader}>
                    <label className={classes.Label}>Password</label>
                </div>
                <Input 
                id="filled-password-input"
                type='password'
                label='Password'
                value={password}
                onChange={event => updateFormHandler(event, 'password')}
                className={classes.Input}
                />
            </div>

            <Button
            disabled={password.length < 8} 
            type='submit'
            buttonClasses='Large Primary Center'
            style={{width: '100%'}}
            >LOG IN</Button>
            
            <p className={classes.LinkText}>Don't have an account? <Link to="/signup" className={classes.Link}>Sign Up</Link></p>
        </form>
    </div>
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticationSuccess: (username, accessToken) => dispatch({type: actionTypes.AUTHENTICATION_SUCCESS, username: username, accessToken: accessToken})
    }
}

export default connect(null, mapDispatchToProps)(Login);
