import React from 'react';

import {
  createStyles,
  Fade,
  InputAdornment,
  TextField,
  withStyles
} from '@material-ui/core';
import { Error } from '@material-ui/icons';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    errorContainer: {
      margin: theme.spacing(2, 0)
    }
  });

type ErrorMessageProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  errorMessage: string;
  showError: boolean;
}>;

/**
 * Shared component for consistent error message displaying.
 * @param ErrorMessageProps
 */
function ErrorMessage({
  classes,
  theme,
  errorMessage,
  showError
}: ErrorMessageProps) {
  return (
    <>
      {showError && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <TextField
            fullWidth
            className={classes.errorContainer}
            error={true}
            variant="outlined"
            value={errorMessage}
            inputProps={{
              readOnly: true,
              disabled: true
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Error color="error" />
                </InputAdornment>
              )
            }}
          />
        </Fade>
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(ErrorMessage);
