import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FlexView from 'react-flexview';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import TypoGraphy from '@material-ui/core/Typography';

const styles = theme => ({
  messagesList: {
    marginBottom: '14px',
    maxHeight: '100%',
    overflow: 'auto' // todo fix not showing scroll bar issue
  },
  message: {
    padding: `0 0 ${theme.spacing.unit}px 0`
  }
});

function MessageList({ classes, messages = [] }) {
  const [messagesEndRef, setMessagesEndRef] = useState('');

  // This effect Scrolls down to the newest message.Triggered by message change.
  useEffect(
    function scrollToBottom() {
      console.log('scrollToBottom effect');
      if (messagesEndRef) {
        messagesEndRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [messages, messagesEndRef]
  );

  return (
    <List dense={true} className={classes.messagesList}>
      {messages.map(({ username, message }, i) => {
        return (
          <ListItem key={i}>
            <ListItemAvatar>
              <Avatar
                src={`https://api.adorable.io/avatars/36/${username}.png`}
                style={{ borderRadius: '25%' }}
              />
            </ListItemAvatar>
            <ListItemText primary={username} secondary={message} />
          </ListItem>
        );
      })}
      <div
        style={{ float: 'left', clear: 'both' }}
        ref={element => setMessagesEndRef(element)}
      />
    </List>
  );
}

MessageList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MessageList);
