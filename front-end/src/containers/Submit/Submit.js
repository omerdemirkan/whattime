import React, {useEffect, useState} from 'react';
import classes from './Submit.module.css';
import axios from '../../axios';

export default function Submit(props) {

    const [survey, setSurvey] = useState(null);

    useEffect(() => {
        const fullPath = props.history.location.pathname;
        const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

        axios.get('/submit/' + id)
        .then(res => {
            setSurvey(res.data)
        })
        .catch(err => {
            props.history.push('/');
        });
    }, []);

    if (!survey) {
        return null
    }

    return <div>
        <h1>{survey.event}</h1>
        <p>{survey.date}</p>
    </div>
}
