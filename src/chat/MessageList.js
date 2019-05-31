import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
// import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  messagesList: {
    marginBottom: '14px',
    maxHeight: '100%',
    overflow: 'auto' // todo fix not showing scroll bar issue,
  }
});

function MessageList({ classes, messages = [] }) {
  const [messagesEndRef, setMessagesEndRef] = useState('');

  // This effect Scrolls down to the newest message. Triggered by message change.
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
          <ListItem className={classes.message} key={i} alignItems="flex-start">
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
