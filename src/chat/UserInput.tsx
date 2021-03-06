import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  createStyles,
  // Slide,
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
      padding: theme.spacing(1, 2),
      animation: `$showInput ${
        theme.transitions.duration.enteringScreen
      } ease-in-out`

      // TODO set height 16px or 14px...
      // 'textAlign': 'center' // prevents scroll bar from showing on parent container
    },
    '@keyframes showInput': {
      '0%': {
        transform: 'translateY(100%)',
        opacity: 0,
        height: 0
      },
      '100%': {
        transform: 'translateY(0%)',
        opacity: 1,
        height: '*'
      }
    },
    sendButton: {
      margin: theme.spacing(1, 0, 0.5, 1),
      minHeight: '56px'
    },
    sendIcon: {
      marginLeft: theme.spacing(1)
    }
  });

const TYPING_TIMEOUT = 2000;

type UserInputProps = {
  classes: any;
  theme: ChatTheme;
  recipientId: string;
  onTyping: (isTyping: boolean) => void;
  onSendMessage: (message: string) => void;
};

function UserInput({
  classes,
  theme,
  recipientId,
  onTyping,
  onSendMessage
}: UserInputProps) {
  const [userInputMap, setUserInputMap] = useState({});
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendKeysPressed = useAreKeysPressed(['Shift', 'Enter']);
  const inputRef = useRef(null);

  const isValidInput = message && !!message.trimRight();

  if (isValidInput && sendKeysPressed) {
    sendMessage();
  }

  useEffect(
    function updateMessageOnRecipientChange() {
      setIsTyping(false);

      const input = userInputMap[recipientId] || '';
      setMessage(input);

      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    },
    [recipientId, inputRef]
  );

  useEffect(
    function emitTypingChange() {
      onTyping(isTyping);
    },
    [isTyping]
  );

  useEffect(
    function setTyping() {
      console.log('in setTyping effect');
      const typingTimeout = setTimeout(
        () => setIsTyping(false),
        TYPING_TIMEOUT
      );
      return () => clearTimeout(typingTimeout);
    },
    [message, setIsTyping]
  );

  function sendMessage() {
    setIsTyping(false);
    onSendMessage(message.trimRight());
    setUserInputMap({
      ...userInputMap,
      [recipientId]: ''
    });
    setMessage('');
  }

  function handleInputChange(event: React.ChangeEvent<{ value: string }>) {
    setIsTyping(true);
    setUserInputMap({
      ...userInputMap,
      [recipientId]: event.target.value
    });
    setMessage(event.target.value);
  }

  return (
    // <Slide
    //   mountOnEnter
    //   unmountOnExit
    //   direction="up"
    //   in={true}
    //   timeout={theme.transitions.duration.enteringScreen}
    // >
    <div className={classes.userInput}>
      <TextField
        fullWidth
        inputRef={inputRef}
        margin="dense"
        id="user-input"
        variant="outlined"
        rows="2"
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
    // </Slide>
  );
}

export default withStyles(styles, { withTheme: true })(UserInput);
