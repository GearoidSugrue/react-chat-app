import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import { FormControl, InputLabel, OutlinedInput } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Theme, withStyles } from '@material-ui/core/styles';
import TypoGraphy from '@material-ui/core/Typography';
import Clear from '@material-ui/icons/Clear';

const styles = (theme: Theme) => ({
  createUserElement: {
    margin: theme.spacing(1),
    minWidth: '300px'
  },
  inputLabel: {
    margin: theme.spacing(1)
  }
});

function CreateUser({ classes, onCreateUser }) {
  const [username, setUsername] = useState('');
  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = useRef(null);

  React.useEffect(function setUsernameLabelWidth() {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<{ value: string }>) =>
    setUsername(event.target.value);

  return (
    <>
      <TypoGraphy
        className={classes.createUserElement}
        variant="h5"
        color="inherit"
      >
        Create New User
      </TypoGraphy>

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
              <IconButton onClick={() => setUsername('')}>
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
