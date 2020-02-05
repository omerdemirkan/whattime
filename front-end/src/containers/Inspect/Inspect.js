import React, {useEffect} from 'react';
import classes from './Inspect.module.css';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import Person from './Person/Person';

function Inspect(props) {

    const fullPath = props.history.location.pathname;
    const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);
    const shareURL = window.location.protocol + "//" + window.location.host + '/submit/' + id;

    useEffect(() => {
        const survey = props.loadedSurveys.filter(survey => survey._id === id)[0] || false;

        if (!survey) {
            props.history.push('/my-surveys');
        } else {
            props.onSetSurvey(survey);
            let cumulativeTimes = [];
            survey.submitions.forEach(submition => {
                console.log(submition.available.length);
                let formattedTimes = []
                for (let i = 0; i < submition.available.length; i += 2) {
                    console.log('inside inner for loop');
                    formattedTimes.push({
                        name: submition.name,
                        time: submition.available[i],
                        isStart: true
                    });
                    formattedTimes.push({
                        name: submition.name,
                        time: submition.available[i + 1],
                        isStart: false
                    });
                }
                cumulativeTimes = cumulativeTimes.concat(formattedTimes);
            });
            cumulativeTimes.sort((a, b) => b - a);
            console.log(cumulativeTimes);
            
        }
    }, [props.loadedSurveys]);

    

    if (!props.survey) {
        return null;
    }
    return <div>
        <h1>{props.survey.event}</h1>
        <p>{props.survey.submitions.length} submitions</p>
        <p>{shareURL}</p>
        {props.survey.submitions.map(submition => {
            return <Person 
            name={submition.name}
            createdAt={submition.createdAt}
            />
        })}
    </div>
}

const mapStateToProps = state => {
    return {
        loadedSurveys: state.surveys.surveys,
        survey: state.inspect.survey
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetSurvey: survey => dispatch({type: actionTypes.SET_INSPECT_SURVEY, survey: survey})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspect);
