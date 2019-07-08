import React, { useState } from 'react';

import { Avatar, Fade, withStyles } from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  avatar: {
    borderRadius: '25%',
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  }
});

type UserAvatarProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  username: string;
}>;

/**
 * A shared component that loads the user's profile image.
 * At the moment it's only using placeholders that are auto-generated based on a the username.
 * Ref: https://api.adorable.io
 * @param UserAvatarProps
 */
function UserAvatar({ classes, theme, username }: UserAvatarProps) {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  const avatarUrl = username
    ? `https://api.adorable.io/avatars/36/${username}.png`
    : '';
  const avatarLetter = username && username.charAt(0).toUpperCase();

  const handleAvatarLoaded = () => setAvatarLoaded(true);

  const handleAvatarLoadError = () => setImgLoadError(true);

  const avatarLetterFragment = (
    <Fade in={imgLoadError} timeout={theme.transitions.duration.enteringScreen}>
      <span>{avatarLetter}</span>
    </Fade>
  );

  const avatarImageFragment = (
    <Fade in={avatarLoaded} timeout={theme.transitions.duration.enteringScreen}>
      <img
        src={avatarUrl}
        onLoad={handleAvatarLoaded}
        onError={handleAvatarLoadError}
      />
    </Fade>
  );

  return (
    <>
      {username && (
        <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
          <Avatar className={classes.avatar}>
            {imgLoadError ? avatarLetterFragment : avatarImageFragment}
          </Avatar>
        </Fade>
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(UserAvatar);
