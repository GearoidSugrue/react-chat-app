import React, { useState } from 'react';
import FlexView from 'react-flexview';

import { Button, createStyles, Fade, withStyles } from '@material-ui/core';

import { ChatTheme, UserType } from 'src/types';
import CreateUser from './CreateUser';
import LoginUser from './LoginUser';

const styles = () =>
  createStyles({
    button: {
      margin: '8px'
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

  const existingUserFragment = (
    <FlexView column>
      <LoginUser onLogin={onLogin} />
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
      <CreateUser onCreateUser={onLogin} />
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
      </FlexView>
    </FlexView>
  );
}

export default withStyles(styles, { withTheme: true })(LoginPage);
