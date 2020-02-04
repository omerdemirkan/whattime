import React from 'react';
import classes from './Notification.module.css';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

function Notification(props) {
    return <>
        <Dialog
        open={props.modalOpen}
        onClose={props.onCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <h1>Error</h1>
            <p>{props.modalMessage}</p>
            <DialogActions>
                <button onClick={props.onCloseModal}>
                    Disagree
                </button>
                <button onClick={props.onCloseModal}>
                    Agree
                </button>
            </DialogActions>
        </Dialog>
    </>
}

const mapStateToProps = state => {
    return {
        modalMessage: state.notification.modalMessage,
        modalOpen: state.notification.modalOpen,
        snackbarMessage: state.notification.snackbarMessage,
        snackbarOpen: state.notification.snackbarOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCloseModal: () => dispatch({type: actionTypes.CLOSE_MODAL}),
        onCloseSnackbar: () => dispatch({type: actionTypes.CLOSE_SNACKBAR})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
