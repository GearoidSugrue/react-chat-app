import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Avatar, Fade, withStyles } from '@material-ui/core';
import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  avatar: {
    borderRadius: '25%'
  },
  loading: {
    background: theme.palette.primary.main,
    transition: 'background-color 1s ease' // todo investigate this vs/and Fade
  }
});

// todo add error case for img loading!
// investigate other animations such as zoom, etc
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
        <Fade in={true} timeout={300}>
          <Avatar
            className={avatarClasses}
            src={avatarUrl}
            onLoad={handleAvatarLoaded}
            onError={handleAvatarLoaded}
          />
        </Fade>
      )}
    </>
  );
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserAvatar);
