import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  createStyles,
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

const styles = (theme: ChatTheme) =>
  createStyles({
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

type CreateUserProps = Readonly<{
  classes: any;
  onCreateUser: ({ username }) => void;
}>;

/**
 * A component for creating new users.
 * @param CreateUserProps
 */
function CreateUser({ classes, onCreateUser }: CreateUserProps) {
  const [username, setUsername] = useState('');
  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = useRef(null);

  useEffect(function setUsernameLabelWidth() {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  function handleUsernameChange(event: React.ChangeEvent<{ value: string }>) {
    setUsername(event.target.value);
  }

  function handleClearUsername() {
    setUsername('');
  }

  function handleCreateUser() {
    onCreateUser({ username });
  }

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
          autoComplete="off"
          autoFocus={true}
          value={username}
          onChange={handleUsernameChange}
          labelWidth={labelWidth}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                className={classes.clearButton}
                onClick={handleClearUsername}
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
        onClick={handleCreateUser}
      >
        Create User
      </Button>
    </>
  );
}

export default withStyles(styles, { withTheme: true })(CreateUser);
