import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Theme, withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';
import Clear from '@material-ui/icons/Clear';

const styles = (theme: Theme) => ({
  createUserElement: {
    margin: '8px'
  }
});

function CreateUser({ classes, onCreateUser }) {
  const [username, setUsername] = useState('');

  return (
    <>
      <TypoGraphy
        className={classes.createUserElement}
        variant="h5"
        color="inherit"
      >
        What's your name?
      </TypoGraphy>
      <Input
        className={classes.createUserElement}
        placeholder="Username"
        value={username}
        onChange={event => setUsername(event.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setUsername('')}>
              <Clear />
            </IconButton>
          </InputAdornment>
        }
      />
      <Button
        className={classes.createUserElement}
        color="secondary"
        variant="contained"
        disabled={!username}
        onClick={() => onCreateUser({ username })}
      >
        Create User
      </Button>
    </>
  );
}

CreateUser.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(CreateUser);
