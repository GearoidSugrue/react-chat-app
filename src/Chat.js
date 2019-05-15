import React, { useState, useEffect } from 'react';
import FlexView from 'react-flexview';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import TypoGraphy from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

// todo: online and offline users

function Chat({ chatroom, username, messages }) {
  console.log('Chat:', chatroom, username, messages)

  return (
    <Fade in={true}>
      <FlexView column grow vAlignContent='top' hAlignContent='left'>
        <TypoGraphy variant="h5" color="inherit">
          Chat room: {chatroom}
          <div>
            User: <Avatar src={`https://api.adorable.io/avatars/36/${username}.png`} style={{ borderRadius: '25%' }} />
          </div>
        </TypoGraphy>
        'Welcome to chat!' + {username}

        {
          <List
            // className={classes.messageList}
            dense={true}
          >
            {
              messages.map(({ username, message }, i) => {
                return (
                  <ListItem key={i}>
                    <ListItemAvatar>
                      <Avatar src={`https://api.adorable.io/avatars/36/${username}.png`} style={{ borderRadius: '25%' }} />
                    </ListItemAvatar >
                    <ListItemText
                      primary={username}
                      secondary={message}
                    />
                  </ListItem >
                )
              })
            }
            {/* hidden div enables scrolling to bottom when new messages comes in */}
            {/* <div
              style={{ float: "left", clear: "both" }}
              ref={element => { this.messagesEnd = element; }}>
            </div> */}
          </List >
        }
      </FlexView>
    </Fade>
  )
}

export default Chat;
