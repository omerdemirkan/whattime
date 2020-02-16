import React from 'react';
import classes from './Footer.module.css';

// Icons
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';

export default function Footer() {
    return <div className={classes.Footer}>
        <div className={classes.InfoBox}>
            <p className={classes.NameText}>Omer Demirkan {new Date().getFullYear()}</p>
            <div className={classes.LinksBox}>
                <a className={classes.Link} 
                href="https://www.linkedin.com/in/omer-demirkan" target="_blank">
                    <LinkedInIcon/>
                </a>

                <a className={classes.Link} 
                href="https://github.com/omerdemirkan" target="_blank">
                    <GitHubIcon/>
                </a>

                <a className={classes.Link} 
                href="mailto:omerfarukpiano@gmail.com">
                    <MailOutlineRoundedIcon/>
                </a>
            </div>
        </div>
    </div>
}
