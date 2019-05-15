
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import TypoGraphy from '@material-ui/core/Typography';
import Clear from '@material-ui/icons/Clear';

function CreateUser({ onCreateUser, onCancel }) {

  const [username, setUsername] = useState('');

  return (
    <>
      <TypoGraphy variant="h5" color="inherit" style={{ margin: '8px' }}>
        What's your name?
      </TypoGraphy>
      <Input
        style={{ margin: '8px' }}
        placeholder="Username"
        value={username}
        onChange={event => setUsername(event.target.value)}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton onClick={() => setUsername('')}>
              <Clear />
            </IconButton>
          </InputAdornment>
        )}
      />
      <Button
        style={{ margin: '8px' }}
        color="secondary"
        variant="contained"
        disabled={!username}
        onClick={() => onCreateUser({ username })}
      >
        Create User
      </Button>
    </>
  )
}

export default CreateUser;
