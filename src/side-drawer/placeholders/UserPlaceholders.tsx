import React from 'react';

import {
  createStyles,
  Fade,
  List,
  ListItem,
  ListItemText,
  withStyles
} from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    placeholderContainer: {
      minHeight: '48px'
    },
    onlineIconPlaceholder: {
      width: '12px',
      height: '12px',
      minWidth: '12px', // adding this prevent the circle from been squished when the username is really long
      transition: 'background-color 0.5s ease',
      background: theme.palette.primary.light,
      borderRadius: '50%',
      display: 'inline-block'
    },
    usernamePlaceholder: {
      width: '66%',
      height: theme.typography.fontSize,
      borderRadius: theme.spacing(0.5),
      background: theme.palette.primary.light,
      margin: theme.spacing(0, 1, 0, 2)
    }
  });

type UserPlaceholdersProps = {
  classes: any;
  theme: ChatTheme;
  placeholderCount: number;
};

function UserPlaceholders({
  classes,
  theme,
  placeholderCount
}: UserPlaceholdersProps) {
  return (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <List disablePadding={true}>
        {[...Array(placeholderCount)].map((_, index) => (
          <ListItem button key={index} className={classes.placeholderContainer}>
            <span className={classes.onlineIconPlaceholder} />
            <ListItemText>
              <div className={classes.usernamePlaceholder} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Fade>
  );
}

export default withStyles(styles, { withTheme: true })(UserPlaceholders);
