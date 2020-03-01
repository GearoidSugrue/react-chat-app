import React, { useState } from 'react';
import FlexView from 'react-flexview';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login'; // useGoogleLogin

import {
  Button,
  createStyles,
  Fade,
  Typography,
  withStyles
} from '@material-ui/core';

import { ChatTheme, UserType } from 'src/types';
import CreateUser from './CreateUser';
import LoginUser from './LoginUser';

const CLIENT_ID: string =
  '846000660038-gd5uokfllcrj421o1c9e2dh3qd0edcsb.apps.googleusercontent.com';

const styles = () =>
  createStyles({
    header: {
      margin: '8px'
    },
    button: {
      margin: '8px',
      borderRadius: '4px !important',
      overflow: 'hidden'
    },
    loginContainer: {
      minWidth: '25%',
      minHeight: '25%',
      alignItems: 'stretch'
    }
  });

type LoginPageProps = {
  classes: any;
  theme: ChatTheme;
  onLogin: (user: UserType) => void;
};

/**
 * Container component for user login page.
 * Flips between user login and user create components.
 * @param LoginPageProps
 */
function LoginPage({ classes, theme, onLogin }: LoginPageProps) {
  const [isNewUser, setIsNewUser] = useState(false);

  const handleGoogleLoginSuccess = (response: GoogleLoginResponse) => {
    console.log('Login Success - response:', response);

    const userInfo = response.getBasicProfile();

    const loggedInUser: UserType = {
      isGuestUser: false,
      online: true,
      userId: userInfo.getId(),
      username: userInfo.getName(),
      imageUrl: userInfo.getImageUrl()
    };
    onLogin(loggedInUser);
  };
  const handleGoogleLoginFailure = (response: GoogleLoginResponse) => {
    console.log('Login Failure - response:', response);
  };

  const handleGuestLogin = user => onLogin({ ...user, isGuestUser: true });

  const existingUserFragment = (
    <FlexView column>
      <LoginUser onLogin={handleGuestLogin} />
      <Button
        className={classes.button}
        color="secondary"
        variant="outlined"
        onClick={() => setIsNewUser(true)}
      >
        New User?
      </Button>
    </FlexView>
  );

  const newUserFragment = (
    <FlexView column>
      <CreateUser onCreateUser={handleGuestLogin} />
      <Button
        className={classes.button}
        color="secondary"
        variant="outlined"
        onClick={() => setIsNewUser(false)}
      >
        Not A New User?
      </Button>
    </FlexView>
  );

  return (
    <FlexView column grow vAlignContent="center" hAlignContent="center">
      <FlexView
        column
        grow
        className={classes.loginContainer}
        vAlignContent="center"
      >
        {!isNewUser && (
          <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
            {existingUserFragment}
          </Fade>
        )}
        {isNewUser && (
          <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
            {newUserFragment}
          </Fade>
        )}

        <Typography className={classes.header} variant="h5" color="inherit">
          Or
        </Typography>
        <GoogleLogin
          theme="dark"
          className={classes.button}
          uxMode="popup"
          clientId={CLIENT_ID}
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
          cookiePolicy={'single_host_origin'}
        />
      </FlexView>
    </FlexView>
  );
}

export default withStyles(styles, { withTheme: true })(LoginPage);
