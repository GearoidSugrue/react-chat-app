import clsx from 'clsx';
import React from 'react';
import FlexView from 'react-flexview';

import { Avatar, Chip, createStyles, withStyles } from '@material-ui/core';

import { fetchUsersStatus, useFetchUsers } from 'src/hooks';
import { OnlineStatusBadge, UserAvatar } from 'src/shared';
import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    title: {
      fontWeight: 300,
      fontSize: '16px'
    },
    chatroomUsersToolbar: {
      height: '0px',
      padding: theme.spacing(0, 1),
      backgroundColor: theme.palette.background.paper,
      overflow: 'hidden',
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    chatroomUsersToolbarVisible: {
      height: '52px'
    },
    chatroomUser: {
      marginLeft: theme.spacing(1)
    },
    userChip: {
      boxShadow: '0 0 0px 1px grey'
    }
  });

type ChatroomMembersToolbarProps = {
  classes: any;
  theme: ChatTheme;
  membersIds: string[];
  isChatroomSelected: boolean;
};

function ChatroomMembersToolbar({
  classes,
  membersIds = [],
  isChatroomSelected
}: ChatroomMembersToolbarProps) {
  const { users = [], status } = useFetchUsers();
  console.log('users users users ', users);

  const toolbarClasses = clsx(
    classes.chatroomUsersToolbar,
    isChatroomSelected && classes.chatroomUsersToolbarVisible
  );

  // todo optimise this!
  const displayUsers = membersIds
    .map(memberId => users.find(user => user.userId === memberId))
    .slice(0, 4)
    .filter(Boolean);
  const usersNotShownCount = membersIds.length - displayUsers.length;

  // todo add loading placeholders
  return (
    <FlexView grow vAlignContent="center" className={toolbarClasses}>
      <div className={classes.title}>Members:</div>
      {isChatroomSelected &&
        status === fetchUsersStatus.SUCCESS &&
        displayUsers.map(user => (
          <div className={classes.chatroomUser} key={user.userId}>
            <Chip
              color="primary"
              variant="default"
              label={user.username}
              classes={{
                root: classes.userChip
              }}
              avatar={
                <OnlineStatusBadge user={user} overlap="circle">
                  <UserAvatar
                    username={user.userId}
                    size="large"
                    variant="circle"
                  />
                </OnlineStatusBadge>
              }
            />
          </div>
        ))}

      {usersNotShownCount > 0 && (
        <div className={classes.chatroomUser}>
          <Avatar>+{usersNotShownCount}</Avatar>
        </div>
      )}
    </FlexView>
  );
}

export default withStyles(styles, { withTheme: true })(ChatroomMembersToolbar);
