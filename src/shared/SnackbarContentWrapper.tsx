import clsx from 'clsx';
import PropTypes from 'prop-types';
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
      // opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    snackbarContainer: {
      // margin: theme.spacing(1)
      fontSize: '16px'
    }
  });

function SnackbarContentWrapper({
  classes,
  message,
  onClose,
  variant,
  action,
  ...other
}) {
  const Icon = variantIcon[variant];

  const snackbarContentClasses = clsx(
    classes[variant],
    classes.snackbarContainer
  );

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
      action={[
        action,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <Close className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

SnackbarContentWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
};

export default withStyles(styles, { withTheme: true })(SnackbarContentWrapper);
