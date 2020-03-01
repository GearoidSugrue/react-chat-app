import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Avatar, Fade, withStyles } from '@material-ui/core';

import { ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) => ({
  avatar: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow: `0px 0px 0px 1px grey`
  },
  small: {
    width: `${theme.avatar.small}px`,
    height: `${theme.avatar.small}px`
  },
  large: {
    width: `${theme.avatar.large}px`,
    height: `${theme.avatar.large}px`
  }
});

type UserAvatarProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  username: string;
  imageUrl?: string;
  size?: 'small' | 'large';
  variant?: 'square' | 'rounded' | 'circle';
  fadeIn?: boolean; // Decides if the component should be faded in. The user img and fallback letter inside the component always fade in.
}>;

/**
 * A shared component that loads the user's profile image.
 * At the moment it's only using placeholders that are auto-generated based on a the username.
 * Ref: https://api.adorable.io
 * @param UserAvatarProps
 */
function UserAvatar({
  classes,
  theme,
  username = '',
  imageUrl,
  size = 'large',
  variant = 'rounded',
  fadeIn = true
}: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  const fadeDuration = fadeIn ? theme.transitions.duration.enteringScreen : 0;

  const avatarLetter = username && username.charAt(0).toUpperCase();

  useEffect(
    function setupAvatarUrl() {
      if (imageUrl) {
        setAvatarUrl(imageUrl);
      } else {
        const strippedUsername = username.replace(/\s+/g, '');

        if (strippedUsername) {
          const imageSize = theme.avatar[size];
          const url = `https://api.adorable.io/avatars/${imageSize}/${strippedUsername}.png`;
          setAvatarUrl(url);
        }
      }
    },
    [imageUrl]
  );

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
        className={classes[size]}
      />
    </Fade>
  );
  const avatarClasses = clsx(classes.avatar, classes[size]);

  return (
    <>
      {username && (
        <Fade in={true} timeout={fadeDuration}>
          <Avatar variant={variant} className={avatarClasses}>
            {imgLoadError ? avatarLetterFragment : avatarImageFragment}
          </Avatar>
        </Fade>
      )}
    </>
  );
}

export default withStyles(styles, { withTheme: true })(UserAvatar);
