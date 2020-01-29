import React, {useEffect} from 'react';
import classes from './MySurveys.module.css';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import axios from '../../axios';

import Survey from '../../components/Survey/Survey';

function MySurveys(props) {
    useEffect(() => {
        const accessToken = props.accessToken;
        if (!accessToken && !props.authLoading) {
            props.history.push('/signup');

        } else if (accessToken) {

            axios.get('/user/surveys', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    currentPosts: 'yeet'
                }
            })
            .then(res => {
                props.onAddSurveys(res.data.surveys, res.data.hasMore);
            })
            .catch(err => {
                console.log(err);
            });

        }
    }, [props.authLoading]);

    // function fetchSurveys() {
    //     axios.get();
    // }
    return <div>
        {props.surveys.map(survey => {
            return <Survey key={survey._id} survey={survey}/>
        })}
        <p>My Surveys</p>
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
        onAddSurveys: (surveys, hasMore) => dispatch({type: actionTypes.ADD_SURVEYS, surveys: surveys, hasMore: hasMore})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySurveys);
