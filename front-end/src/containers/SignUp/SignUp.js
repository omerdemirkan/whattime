import React, {useState, useEffect} from 'react';
import classes from './SignUp.module.css';
import useDebounce from '../Hooks/useDebounce';
import axios from '../../axios';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';


function SignUp(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [usernameIsUnique, setUsernameIsUnique] = useState(false);

    const debouncedUsername = useDebounce(username, 800);

    function updateFormHandler(event, input) {
        switch(input) {
            case 'username':
                const updatedUsername = event.target.value.replace(/\s/g, '');

                if (!updatedUsername.match(/^[a-zA-Z0-9]+$/)) break;

                if (updatedUsername.length <= 20) {
                    setUsername(updatedUsername);
                    setUsernameIsUnique('unknown');
                }
                break;
            case 'password':

                setPassword(event.target.value.trim());
                
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

    useEffect(() => {
        if (debouncedUsername.length >= 4) {
            axios.post('/auth/is-username-unique', {
                username: debouncedUsername
            })
            .then(res => {
                if (res.data !== usernameIsUnique) {
                    setUsernameIsUnique(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [debouncedUsername]);

    return <div>
        <form onSubmit={submitForm}>
            <label>Username ({usernameIsUnique === true ? 'unique': usernameIsUnique})</label>
            <input 
            type='text'
            value={username}
            onChange={event => updateFormHandler(event, 'username')}
            />
            <label>Password</label>
            <input 
            type='password' 
            value={password}
            onChange={event => updateFormHandler(event, 'password')}
            />
            <label>Re-enter Password</label>
            <input disabled={usernameIsUnique !== true || password.length < 8} type='submit'/>
        </form>
        <h1>{debouncedUsername}</h1>
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
