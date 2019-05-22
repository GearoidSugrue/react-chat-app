import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FlexView from 'react-flexview';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';

import LoginUser from './LoginUser';
import CreateUser from './CreateUser';

const styles = theme => ({
  // todo move inline css here 
});

function LoginPage({ onLogin }) {
  const [isNewUser, setIsNewUser] = useState(false);

  const existingUserFragment = (
    <FlexView column>
      <LoginUser onLogin={onLogin}></LoginUser>
      <Button
        style={{ margin: '8px' }}
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
      <CreateUser onCreateUser={onLogin}></CreateUser>
      <Button
        style={{ margin: '8px' }}
        color="secondary"
        variant="outlined"
        onClick={() => setIsNewUser(false)}
      >
        Not A New User?
      </Button>
    </FlexView>
  );

  return (
    <FlexView column grow vAlignContent='center' hAlignContent='center' >
      <FlexView column grow vAlignContent='center' style={{ minWidth: '25%', minHeight: '25%', alignItems: 'stretch' }}>
        {
          !isNewUser &&
          <Fade in={true} timeout={600}>
            {existingUserFragment}
          </Fade>
        }
        {
          isNewUser &&
          <Fade in={true} timeout={600}>
            {newUserFragment}
          </Fade>
        }
      </FlexView>
    </FlexView >
  )
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginPage);