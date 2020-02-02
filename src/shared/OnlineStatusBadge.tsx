import clsx from 'clsx';
import React from 'react';

import { Badge } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/styles';

import { useOnlineStatus } from 'src/hooks';
import { ChatTheme, OnlineStatusMessage } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    circle: {
      width: '12px',
      height: '12px',
      minWidth: '12px', // adding this prevent the circle from been squished when the username is really long
      transition: 'background-color 0.5s ease',
      background: theme.chatColors.offline,
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: `0 0 1px 1px ${theme.palette.primary.main}`
    },
    online: {
      color: theme.chatColors.online,
      background: theme.chatColors.online,
      '&::after': {
        position: 'absolute',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(0.9)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(1.4)',
        opacity: 0
      }
    }
  });

type OnlineStatusBadgeProps = Readonly<{
  classes: any;
  children: any;
  theme: ChatTheme;
  user: OnlineStatusMessage;
  overlap?: 'circle' | 'rectangle';
}>;

function OnlineStatusBadge({
  classes,
  children,
  user,
  overlap = 'circle'
}: OnlineStatusBadgeProps) {
  const online = useOnlineStatus(user);

  console.log('user online badge', online);

  const onlineIconClasses = clsx(classes.circle, online && classes.online);

  return (
    <Badge
      overlap={overlap}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      badgeContent={<span className={onlineIconClasses} />}
    >
      {children}
    </Badge>
  );
}

export default withStyles(styles, { withTheme: true })(OnlineStatusBadge);
