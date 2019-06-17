import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Slide, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
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
    padding: theme.spacing(1)
  },
  sendButton: {
    margin: theme.spacing(1, 0, 1, 1)
  },
  sendIcon: {
    marginLeft: theme.spacing(1)
  }
});

function UserInput({ classes, theme, recipientId, onSendMessage }) {
  const [userInputMap, setUserInputMap] = useState({});
  const [message, setMessage] = useState('');
  const sendKeysPressed = useAreKeysPressed(['Shift', 'Enter']);

  const isValidInput = message && !!message.trimRight(); // removes trailing new lines

  if (isValidInput && sendKeysPressed) {
    sendMessage();
  }

  useEffect(
    function updateMessageOnRecipientChange() {
      // todo try to set autoFocus back onto TextField
      const input = userInputMap[recipientId] || '';
      setMessage(input);
    },
    [recipientId]
  );

  function sendMessage() {
    onSendMessage(message);
    setUserInputMap({
      ...userInputMap,
      [recipientId]: ''
    });
    setMessage('');
  }

  function handleInputChange(event: React.ChangeEvent<{ value: string }>) {
    setUserInputMap({
      ...userInputMap,
      [recipientId]: event.target.value
    });
    setMessage(event.target.value);
  }

  return (
    <Slide
      mountOnEnter
      unmountOnExit
      direction="up"
      in={true}
      timeout={theme.transitions.duration.enteringScreen}
    >
      <div className={classes.userInput}>
        <TextField
          fullWidth
          margin="dense"
          id="user-input"
          variant="outlined"
          rows="1"
          rowsMax="4"
          autoFocus={true}
          multiline={true}
          label="Send a message (Shift + Enter)"
          value={message}
          onChange={handleInputChange}
        />

        <Button
          variant="contained"
          color="secondary"
          className={classes.sendButton}
          disabled={!userInputMap[recipientId]}
          onClick={sendMessage}
        >
          Send
          <Send className={classes.sendIcon} />
        </Button>
      </div>
    </Slide>
  );
}

UserInput.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserInput);
