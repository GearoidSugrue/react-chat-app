import * as React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import App from 'src/App';
import { ChatApiProvider } from 'src/chat-api';
import * as serviceWorker from 'src/serviceWorker';
import { ChatThemeOptions } from 'src/types';

const themeOptions: ChatThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#34495e' // Navy-blue
    },
    secondary: {
      main: '#00b16a', // Jade
      contrastText: '#fff' // uses white text on buttons
    },
    error: {
      main: '#e74c3c', // Alizarin
      contrastText: '#fff' // White
    },
    background: {
      default: '#2e3032',
      paper: '#3d4043'
    },
    action: {
      selected: '#35393b' // overrides light grey default with a darker grey
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // ? should this be 16px?
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500
  },
  sideDrawer: {
    width: '240px'
  },
  chatColors: {
    offline: '#2b2e30', // Dark-gray
    online: '#00b16a', // Jade
    success: '#00b16a' // Jade
  }
};
const theme = createMuiTheme(themeOptions);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
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
