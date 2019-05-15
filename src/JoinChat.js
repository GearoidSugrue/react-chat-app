
import React, { useState } from 'react';
import FlexView from 'react-flexview';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import TypoGraphy from '@material-ui/core/Typography';


// TODO: Make chatroom a selection and an option to create new chatroom

function JoinChat({ onJoinChat }) {
  const [username, setUsername] = useState('');
  const [chatroom, setChatroom] = useState('');

  return (
    // <div className="Join-Chat-Container">
    <FlexView column grow vAlignContent='center' hAlignContent='center'>
      <FlexView column hAlignContent='left'>

        <TypoGraphy variant="h5" color="inherit">
          What's your name?
        </TypoGraphy>
        <Input
          placeholder="Username"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />

        <TypoGraphy variant="h5" color="inherit">
          What's chat do you want to join?
        </TypoGraphy>
        <Input
          placeholder="Chat room"
          value={chatroom}
          onChange={event => setChatroom(event.target.value)}
        />

        <div>
          <Button
            // className="Join-Button"
            color="secondary"
            disabled={!username || !chatroom}
            onClick={() => onJoinChat({ chatroom, username })}
          >
            Join chat
          </Button>
        </div>

      </FlexView>
    </FlexView>
  )
}

export default JoinChat;
