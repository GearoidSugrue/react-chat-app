import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { Theme, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import FlexView from 'react-flexview';

import CreateUser from './CreateUser';
import LoginUser from './LoginUser';

const styles = (theme: Theme) => ({
  button: {
    margin: '8px'
  }
});

function LoginPage({ classes, onLogin }) {
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
        vAlignContent="center"
        style={{ minWidth: '25%', minHeight: '25%', alignItems: 'stretch' }}
      >
        {!isNewUser && (
          <Fade in={true} timeout={300}>
            {existingUserFragment}
          </Fade>
        )}
        {isNewUser && (
          <Fade in={true} timeout={300}>
            {newUserFragment}
          </Fade>
        )}
      </FlexView>
    </FlexView>
  );
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginPage);
