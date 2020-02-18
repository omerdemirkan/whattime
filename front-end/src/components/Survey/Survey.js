import React, { useState } from 'react';
import classes from './Survey.module.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../UI/Button/Button';

import TimeAgo from 'timeago-react';

import getDisplayDate from '../../helper/getDisplayDate';

function Survey(props) {

    const [deleteSurveyModal, setDeleteSurveyModal] = useState(false);

    function inspectRedirect() {
        props.history.push('/my-surveys/' + props.survey._id);
    }

    const numSubmitions = props.survey.submitions.length;

    return <div className={classes.Survey}>
        <div className={classes.Header}>
            <h3 className={classes.EventName + ' purple'} onClick={inspectRedirect}>{props.survey.event}</h3>
            <p className={classes.CreatedAt}>
                created <TimeAgo
                datetime={props.survey.createdAt} 
                />
            </p>
        </div>
        
        <p>{numSubmitions} submition{numSubmitions === 1 ? null : 's'}</p>
        <p>Date: {getDisplayDate(props.survey.date)}</p>
        <span onClick={() => setDeleteSurveyModal(true)} className={classes.DeleteButton}>DELETE</span>

        <Dialog
        open={deleteSurveyModal}
        onClose={() => setDeleteSurveyModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{borderRadius: '0'}}
        >
            <div className={classes.DeleteModal}>
                <h3 className={classes.ModalHeader}>Are you sure you want to delete {props.name}'s submition?</h3>
                <DialogActions>
                    <Button 
                    onClick={() => setDeleteSurveyModal(false)}
                    buttonClasses='Large'>
                        NO
                    </Button>
                    <Button 
                    onClick={props.delete}
                    buttonClasses='Large'>
                        YES
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    </div>
}

export default Survey;
