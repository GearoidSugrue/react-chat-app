import { Theme } from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

/**
 * Extends the Material UI Theme with the chat app's custom theme properties.
 */
export interface ChatTheme extends Theme {
  sideDrawer: {
    width: string;
  };
  chatColors: {
    offline: string;
    online: string;
    success: string;
    greyText: string;
  };
}

/**
 * This is only used to type the object literal used when creating an instance of a theme.
 */
export interface ChatThemeOptions extends ThemeOptions {
  sideDrawer: {
    width: string;
  };
  chatColors: {
    offline: string;
    online: string;
    success: string;
    greyText: string;
  };
}
