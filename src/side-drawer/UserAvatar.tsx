import React, { useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import { Theme, withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  avatar: {
    borderRadius: '25%'
  },
  loading: {
    background: theme.palette.primary.main
  }
});

function UserAvatar({ classes, username }) {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const avatarClasses = clsx(
    classes.avatar,
    !isAvatarLoaded && classes.loading
  );

  const handleAvatarLoaded = () => setIsAvatarLoaded(true);

  const avatarUrl = username
    ? `https://api.adorable.io/avatars/36/${username}.png`
    : '';

  return (
    <>
      {/* todo check if this works as expected  */}
      {username && (
        <Avatar
          className={avatarClasses}
          src={avatarUrl}
          onLoad={handleAvatarLoaded}
        />
      )}
    </>
  );
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserAvatar);
