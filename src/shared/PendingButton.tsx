import React from 'react';

import { CircularProgress, createStyles, withStyles } from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    createButtonWrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    buttonPending: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    }
  });

type PendingButtonProps = Readonly<{
  classes: any;
  button: any; // TODO: Look at material-ui and React component composition to see if it's a better way to do this
  pending: boolean;
}>;

/**
 * A shared component for wrapping buttons.
 * It disables the button when pending and overlays a progress spinner.
 * @param PendingButtonProps
 */
function PendingButton({ classes, button, pending }: PendingButtonProps) {
  return (
    <div className={classes.createButtonWrapper}>
      {button}
      {pending && (
        <CircularProgress size={24} className={classes.buttonPending} />
      )}
    </div>
  );
}

export default withStyles(styles)(PendingButton);
