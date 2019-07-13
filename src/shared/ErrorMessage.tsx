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

const styles = () => createStyles({});

type ErrorMessageProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  errorMessage: string;
  showError: boolean;
  action?: any; // TODO type this properly
}>;

/**
 * Shared component for consistent error message displaying.
 * @param ErrorMessageProps
 */
function ErrorMessage({
  theme,
  errorMessage,
  showError,
  action
}: ErrorMessageProps) {
  return (
    <>
      {showError && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <TextField
            fullWidth
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
              ),
              endAdornment: action || ''
            }}
          />
        </Fade>
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(ErrorMessage);
