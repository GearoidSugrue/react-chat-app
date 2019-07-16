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
  Typography,
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
      height: '16px',
      margin: '4px 0'
    },
    secondaryTextPlaceholder: {
      width: '40%',
      minWidth: '180px',
      height: '16px',
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

  // ! FIX: Error ""...validateDOMNesting(...): <div> cannot appear as a descendant of <p>. ..." Most likely caused by the way ListItemText primary and secondary are used
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
              primary={<Typography className={primaryTextPlaceholderClasses} />}
              secondary={
                <Typography className={secondaryTextPlaceholderClasses} />
              }
            />
          </ListItem>
        ))}
      </List>
    </Fade>
  );
}

export default withStyles(styles, { withTheme: true })(MessagePlaceholders);
