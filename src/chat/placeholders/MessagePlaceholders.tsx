import clsx from 'clsx';
import React from 'react';

import {
  Avatar,
  createStyles,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  withStyles
} from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    messagesPlaceholder: {
      minHeight: '60px'
    },
    avatarPlaceholder: {
      borderRadius: '25%',
      background: theme.palette.primary.light
    },
    loading: {
      width: '200px',
      height: '16px',
      background: theme.palette.primary.light,
      borderRadius: theme.spacing(0.5)
    },
    primaryTextPlaceholder: {
      width: '5%',
      minWidth: '120px',
      margin: '4px 0'
    },
    secondaryTextPlaceholder: {
      width: '40%',
      minWidth: '180px',
      margin: '8px 0 4px'
    }
  });

type MessagePlaceholdersProps = {
  classes: any;
  theme: ChatTheme;
  placeholderCount: number;
};

function MessagePlaceholders({
  classes,
  theme,
  placeholderCount
}: MessagePlaceholdersProps) {
  const primaryTextPlaceholderClasses = clsx(
    classes.loading,
    classes.primaryTextPlaceholder
  );
  const secondaryTextPlaceholderClasses = clsx(
    classes.loading,
    classes.secondaryTextPlaceholder
  );

  return (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <List dense={true} className={classes.messagesPlaceholder}>
        {[...Array(placeholderCount)].map((_, index) => (
          <ListItem
            className={classes.message}
            key={index}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Avatar className={classes.avatarPlaceholder} />
            </ListItemAvatar>
            <ListItemText
              primary={<div className={primaryTextPlaceholderClasses} />}
              secondary={<div className={secondaryTextPlaceholderClasses} />}
            />
          </ListItem>
        ))}
      </List>
    </Fade>
  );
}

export default withStyles(styles, { withTheme: true })(MessagePlaceholders);
