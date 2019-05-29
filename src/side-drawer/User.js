import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
// import FlexView from 'react-flexview';

import { withStyles } from '@material-ui/core/styles';
// import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import useOnlineStatus from '../hooks/OnlineStatus.hook';

const styles = theme => ({
  circle: {
    width: '12px',
    height: '12px',
    transition: 'background-color 0.5s ease',
    background: '#bdc3c7',
    'border-radius': '50%',
    // borderRadius: '50%',
    display: 'inline-block',
    margin: 'auto'
    // 'box-shadow': '0 0 1px 1px #ecf0f1'
  },
  online: {
    background: '#2ecc71'
  }
  // offline: {
  //   background: 'grey'
  // }
});

function User({ classes, user, onUserSelected }) {
  const online = useOnlineStatus(user);

  return (
    <ListItem button onClick={() => onUserSelected(user)}>
      {/* <div> */}
      <span
        className={classNames(classes.circle, {
          [classes.online]: online
        })}
      />
      {/* </div> */}
      <ListItemText primary={user.username} />
    </ListItem>
  );
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(User);
