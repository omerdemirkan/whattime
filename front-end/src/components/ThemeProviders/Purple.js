import React from 'react';

// Material UI styling
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const materialTheme = createMuiTheme({
    palette: {
        primary: {
            500: '#6C63FF'
        }
    }
});

export default function Purple(props) {
    return <ThemeProvider theme={materialTheme}>{props.children}</ThemeProvider>
}
