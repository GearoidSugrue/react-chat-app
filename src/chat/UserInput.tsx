import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Input from '@material-ui/core/Input';
import { Theme, withStyles } from '@material-ui/core/styles';

import Send from '@material-ui/icons/Send';

import { useAreKeysPressed } from '../hooks/KeysPressPressed.hook';

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
    <Fade in={true} timeout={600}>
      <div className={classes.userInput}>
        <Input
          multiline
          className={classes.textInput}
          autoFocus={true}
          rowsMax="3"
          rows="1"
          placeholder="Send a message (Shift + Enter)"
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
