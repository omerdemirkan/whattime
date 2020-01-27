import React, {useState, useEffect} from 'react';
import classes from './SignUp.module.css';

import useDebounce from '../Hooks/useDebounce';

import axios from '../../axios';

function SignUp() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [usernameIsValid, setUsernameIsValid] = useState(false);

    const debouncedUsername = useDebounce(username, 800);

    function updateFormHandler(event, input) {
        switch(input) {
            case 'username':
                const updatedUsername = event.target.value.replace(/\s/g, '');
                if (updatedUsername.length <= 20) {
                    setUsername(updatedUsername);
                    setUsernameIsValid('unknown');
                }
                break;
            case 'password':

                setPassword(event.target.value.trim());
                
                break;
        }
    }

    function submitForm(event) {
        event.preventDefault();
        
    }

    useEffect(() => {
        if (debouncedUsername.length >= 4) {
            axios.post('/auth/is-username-unique', {
                username: debouncedUsername
            })
            .then(res => {
                if (res.data !== usernameIsValid) {
                    setUsernameIsValid(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [debouncedUsername]);

    console.log('usernameIsValid:', usernameIsValid);
    return <div>
        <form onSubmit={submitForm}>
            <label>Username</label>
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
            <input type='submit'/>
        </form>
        <h1>{debouncedUsername}</h1>
    </div>
}

export default SignUp;
