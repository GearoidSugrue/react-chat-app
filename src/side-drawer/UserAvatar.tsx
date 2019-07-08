import clsx from 'clsx';
import React, { useState } from 'react';

import { Avatar, Fade, withStyles } from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  avatar: {
    borderRadius: '25%'
  },
  loading: {
    background: theme.palette.primary.light,
    transition: 'background-color 1s ease' // TODO investigate this vs/and Fade
  }
});

type UserAvatarProps = Readonly<{
  classes: any;
  username: string;
}>;

// TODO move to shared components
// TODO add error case for img loading!
// TODO investigate other animations such as zoom, etc

/**
 * A shared component that loads the user's profile image.
 * At the moment it's only using placeholders that are auto-generated based on a the username.
 * Ref: https://api.adorable.io
 * @param UserAvatarProps
 */
function UserAvatar({ classes, username }: UserAvatarProps) {
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
      {/* // TODO check if this works as expected  */}
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

export default withStyles(styles, { withTheme: true })(UserAvatar);
