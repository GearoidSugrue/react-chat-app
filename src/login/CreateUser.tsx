import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  withStyles
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  createUserElement: {
    margin: theme.spacing(1),
    minWidth: '300px'
  },
  inputLabel: {
    margin: theme.spacing(1)
  },
  clearButton: {
    marginRight: '-10px'
  }
});

function CreateUser({ classes, onCreateUser }) {
  const [username, setUsername] = useState('');
  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = useRef(null);

  useEffect(function setUsernameLabelWidth() {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<{ value: string }>) =>
    setUsername(event.target.value);

  return (
    <>
      <Typography
        className={classes.createUserElement}
        variant="h5"
        color="inherit"
      >
        Create New User
      </Typography>

      <FormControl variant="outlined">
        <InputLabel
          className={classes.inputLabel}
          ref={labelRef}
          htmlFor="username-input"
        >
          Username
        </InputLabel>
        <OutlinedInput
          className={classes.createUserElement}
          id="username-input"
          autoFocus={true}
          value={username}
          onChange={handleUsernameChange}
          labelWidth={labelWidth}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                className={classes.clearButton}
                onClick={() => setUsername('')}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

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
