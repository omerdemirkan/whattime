import {useEffect} from 'react';

import { connect } from 'react-redux'

function AuthRequired(props) {
    useEffect(() => {
        const accessToken = props.accessToken;
        if (!accessToken && !props.authLoading) {
            props.history.push('/signup');

        }
    }, [props.authLoading]);
    return null;
}

const mapStateToProps = state => {
    return {
        accessToken: state.auth.accessToken,
        authLoading: state.auth.loading
    }
}

export default connect(mapStateToProps)(AuthRequired);
