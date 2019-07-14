import React from 'react';

import {
  createStyles,
  Fade,
  List,
  ListItem,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    placeholderContainer: {
      minHeight: '48px'
    },
    namePrefix: {
      color: '#bdc3c7', // TODO move to ChatTheme
      fontWeight: 500,
      margin: '0 1px'
    },
    namePlaceholder: {
      width: '66%',
      height: theme.typography.fontSize,
      borderRadius: theme.spacing(0.5),
      background: theme.palette.primary.light,
      marginLeft: theme.spacing(2)
    }
  });

type ChatroomPlaceholdersProps = {
  classes: any;
  theme: ChatTheme;
  placeholderCount: number;
};

function ChatroomPlaceholders({
  classes,
  theme,
  placeholderCount
}: ChatroomPlaceholdersProps) {
  return (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <List disablePadding={true}>
        {[...Array(placeholderCount)].map((_, index) => (
          <ListItem button key={index} className={classes.placeholderContainer}>
            <Typography className={classes.namePrefix}>#</Typography>
            <ListItemText>
              <div className={classes.namePlaceholder} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Fade>
  );
}

export default withStyles(styles, { withTheme: true })(ChatroomPlaceholders);
