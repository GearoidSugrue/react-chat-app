import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  createStyles,
  Slide,
  TextField,
  withStyles
} from '@material-ui/core';
import { Send } from '@material-ui/icons';

import { useAreKeysPressed } from 'src/hooks';
import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    userInput: {
      display: 'flex',
      padding: theme.spacing(1, 2)
      // todo set height 16px or 14px...
      // 'textAlign': 'center' // prevents scroll bar from showing on parent container
    },
    sendButton: {
      margin: theme.spacing(1, 0, 0.5, 1),
      minHeight: '56px'
    },
    sendIcon: {
      marginLeft: theme.spacing(1)
    }
  });

function UserInput({ classes, theme, recipientId, onSendMessage }) {
  const [userInputMap, setUserInputMap] = useState({});
  const [message, setMessage] = useState('');
  const sendKeysPressed = useAreKeysPressed(['Shift', 'Enter']);
  const inputRef = useRef(null);

  const isValidInput = message && !!message.trimRight(); // removes trailing new lines

  if (isValidInput && sendKeysPressed) {
    sendMessage();
  }

  useEffect(
    function updateMessageOnRecipientChange() {
      // todo try to set autoFocus back onto TextField
      const input = userInputMap[recipientId] || '';
      setMessage(input);

      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
    [recipientId, inputRef]
  );

  function sendMessage() {
    onSendMessage(message.trimRight());
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
          inputRef={inputRef}
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
