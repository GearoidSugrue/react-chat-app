import React from 'react';
import FlexView from 'react-flexview/lib';

import { createStyles, Fade, TextField, withStyles } from '@material-ui/core';
import { Error } from '@material-ui/icons';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    errorElement: {
      margin: theme.spacing(1, 2)
    }
  });

type ErrorMessageProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  errorMessage: string;
  showError: boolean;
  action?: any; // TODO type this properly
  className?: string;
}>;

/**
 * Shared component for consistent error message displaying.
 * @param ErrorMessageProps
 */
function VerticalErrorMessage({
  classes,
  theme,
  errorMessage,
  showError,
  action,
  className
}: ErrorMessageProps) {
  return (
    <>
      {showError && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <FlexView column vAlignContent="center" hAlignContent="center">
            <Error color="error" className={classes.errorElement} />
            <TextField
              error
              variant="outlined"
              id="error-message"
              value={errorMessage}
              inputProps={{
                readOnly: true,
                disabled: true
              }}
              className={className}
            />
            <div className={classes.errorElement}>{action}</div>
          </FlexView>
        </Fade>
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(VerticalErrorMessage);
