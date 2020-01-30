import React, {useEffect} from 'react';
import classes from './MySurveys.module.css';
import {connect} from 'react-redux';
import loadSurveysAsync from '../../store/actions/loadSurveys';

import axios from '../../axios';

import Survey from '../../components/Survey/Survey';

function MySurveys(props) {
    useEffect(() => {
        const accessToken = props.accessToken;
        if (!accessToken && !props.authLoading) {
            props.history.push('/signup');

        } else if (accessToken && props.surveys.length === 0) {

            props.onLoadSurveys(accessToken, 0)
        }
    }, [props.authLoading]);

    // function fetchSurveys() {
    //     axios.get();
    // }
    return <div>
        {props.surveys.map(survey => {
            return <Survey
            key={survey._id} 
            survey={survey}
            history={props.history}/>
        })}
    </div>
}

const mapStateToProps = state => {
    return {
        surveys: state.surveys.surveys,
        accessToken: state.auth.accessToken,
        authLoading: state.auth.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadSurveys: (accessToken, currentPosts) => dispatch(loadSurveysAsync(accessToken, currentPosts))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySurveys);
