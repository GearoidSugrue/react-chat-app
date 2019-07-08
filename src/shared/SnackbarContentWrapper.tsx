import clsx from 'clsx';
import React from 'react';

import {
  createStyles,
  IconButton,
  SnackbarContent,
  withStyles
} from '@material-ui/core';
import { amber } from '@material-ui/core/colors';
import { CheckCircle, Close, Error, Info, Warning } from '@material-ui/icons';

import { ChatTheme } from 'src/types';

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info
};

const styles = (theme: ChatTheme) =>
  createStyles({
    success: {
      backgroundColor: theme.chatColors.success,
      color: theme.palette.secondary.contrastText
    },
    error: {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.secondary.contrastText
    },
    info: {
      backgroundColor: theme.palette.primary.main
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      marginRight: theme.spacing(1)
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    snackbarContainer: {
      fontSize: '16px'
    }
  });

type SnackbarContentWrapperProps = Readonly<{
  classes: any;
  variant: keyof typeof variantIcon;
  message: string;
  action?: any; // TODO find proper type for this
  onClose: (event: any, reason?: string) => void;
}>;

function SnackbarContentWrapper({
  classes,
  variant,
  message,
  action,
  onClose,
  ...other
}: SnackbarContentWrapperProps) {
  const Icon = variantIcon[variant];

  const snackbarContentClasses = clsx(
    classes[variant],
    classes.snackbarContainer
  );

  const closeIconButton = (
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      onClick={onClose}
    >
      <Close className={classes.icon} />
    </IconButton>
  );

  const snackbarActions = action
    ? [action, closeIconButton]
    : [closeIconButton];

  return (
    <SnackbarContent
      className={snackbarContentClasses}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={snackbarActions}
      {...other}
    />
  );
}

export default withStyles(styles, { withTheme: true })(SnackbarContentWrapper);
