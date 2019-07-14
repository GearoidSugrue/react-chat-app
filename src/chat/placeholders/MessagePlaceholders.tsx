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
    avatarPlaceholder: {
      borderRadius: '25%',
      background: theme.palette.primary.light
    },
    loading: {
      width: '200px',
      height: theme.typography.fontSize,
      margin: '4px 0',
      background: theme.palette.primary.light,
      borderRadius: theme.spacing(0.5)
    },
    primaryTextPlaceholder: {
      width: '25%'
    },
    secondaryTextPlaceholder: {
      width: '50%'
    }
  });

type MessagePlaceholdersProps = {
  classes: any;
  theme: ChatTheme;
  placeholderCount: number;
};

function MessagePlaceholders({
  classes,
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
    <Fade in={true} timeout={1000}>
      <List dense={true}>
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
