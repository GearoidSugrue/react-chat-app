import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import Fade from '@material-ui/core/Fade';
import Input from '@material-ui/core/Input';

import Send from '@material-ui/icons/Send';
import { useAreKeysPressed } from '../hooks/KeysPressPressed.hook';

const styles = theme => ({
  userInput: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2)
    // 'text-align': 'start' // prevents scroll bar from showing on parent container
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
    <div className={classes.userInput}>
      <Input
        multiline
        className={classes.textInput}
        autoFocus={true}
        rowsMax="4"
        rows="1"
        placeholder="Send a message (Shift + Enter)"
        value={userInput}
        onChange={event => setUserInput(event.target.value)}
      />
      <Button
        className={classes.sendButton}
        color="secondary"
        disabled={!userInput}
        onClick={sendMessage}
      >
        Send
        <Send className={classes.sendIcon} />
      </Button>
    </div>
  );
}

UserInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserInput);
