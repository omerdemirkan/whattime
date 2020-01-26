import React from 'react';
import classes from './SignUp.module.css';

import axios from '../../axios';

function SignUp() {
    function submitForm(event) {
        event.preventDefault();
        
    }
    return <div>
        <form onSubmit={event => submitForm(event)}>
            <input type='email' placeholder='Email'/>
            <input type='text' placeholder='Username'/>
            <input type='password' placeholder='Password'/>
            <input type='submit'/>
        </form>
        
    </div>
}

export default SignUp;
