import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { Theme, withStyles } from '@material-ui/core/styles';
import Send from '@material-ui/icons/Send';

import { useAreKeysPressed } from 'src/hooks/KeysPressPressed.hook';

const styles = (theme: Theme) => ({
  userInput: {
    display: 'flex',
    padding: theme.spacing(1, 2),
    'text-align': 'start' // prevents scroll bar from showing on parent container
  },
  textInput: {
    flex: 1
  },
  sendButton: {
    margin: theme.spacing(1)
  },
  sendIcon: {
    marginLeft: theme.spacing(1)
  }
});

function UserInput({ classes, onSendMessage }) {
  const [userInput, setUserInput] = useState('');
  const isValidInput = !!userInput.trimRight(); // removes trailing new lines

  const sendKeysPressed = useAreKeysPressed(['Shift', 'Enter']);

  const sendMessage = () => {
    setUserInput('');
    onSendMessage(userInput);
  };

  if (isValidInput && sendKeysPressed) {
    sendMessage();
  }

  return (
    <Fade in={true} timeout={300}>
      <div className={classes.userInput}>
        <TextField
          fullWidth
          className={classes.textInput}
          id="user-input"
          variant="outlined"
          rows="1"
          rowsMax="3"
          autoFocus={true}
          multiline={true}
          label="Send a message (Shift + Enter)"
          value={userInput}
          onChange={event => setUserInput(event.target.value)}
        />

        <Button
          variant="contained"
          color="secondary"
          className={classes.sendButton}
          disabled={!userInput}
          onClick={sendMessage}
        >
          Send
          <Send className={classes.sendIcon} />
        </Button>
      </div>
    </Fade>
  );
}

UserInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserInput);
