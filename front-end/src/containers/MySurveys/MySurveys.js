import React, {useEffect} from 'react';
import classes from './MySurveys.module.css';
import {connect} from 'react-redux';

import axios from '../../axios';

import Survey from '../../components/Survey/Survey';

function MySurveys(props) {
    useEffect(() => {

    }, []);

    function fetchSurveys() {
        axios.get();
    }
    return <div>
        <Survey/>
        <p>My Surveys</p>
    </div>
}

const mapStateToProps = state => {
    return {
        surveys: state.surveys.surveys
    }
}

export default connect(mapStateToProps)(MySurveys);
