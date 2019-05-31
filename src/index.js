import React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { ChatApiProvider } from './chat-api/ChatApiContext';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700]
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700]
    }
  },
  sideDrawer: {
    width: '240px'
  }
});

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
