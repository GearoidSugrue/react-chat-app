import * as React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { ChatApiProvider } from './chat-api/ChatApiContext';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#60748b',
      main: '#34495e',
      dark: '#092234'
    },
    secondary: {
      light: '#6effa0',
      main: '#2ecc71',
      dark: '#009a44'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500
  },
  sideDrawer: {
    width: '240px'
  }
} as ThemeOptions);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    {/* CssBaseline kick start an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <ChatApiProvider>
      <App />
    </ChatApiProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
