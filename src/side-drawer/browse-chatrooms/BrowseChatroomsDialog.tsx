import { OptionsObject, useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  Typography,
  withMobileDialog,
  withStyles
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { useChatApi } from 'src/chat-api';
import { fetchRoomsStatus, useFetchRooms, useUserLogin } from 'src/hooks';
import SearchableSelect, {
  SearchableOption
} from 'src/searchable-select/SearchableSelect';
import ErrorMessage from 'src/shared/ErrorMessage';
import PendingButton from 'src/shared/PendingButton';
import { ChatroomType, ChatTheme } from 'src/types';

const styles = (theme: ChatTheme) =>
  createStyles({
    browseChatroomElement: {
      margin: theme.spacing(2, 0)
    },
    loading: {
      background: theme.palette.primary.light,
      minHeight: '64px',
      margin: theme.spacing(2, 0),
      borderRadius: theme.spacing(0.5)
    },
    loadingFailedContainer: {
      minHeight: '64px'
    },
    retryButton: {
      marginLeft: theme.spacing(1)
    }
  });

function createSearchableRoom(room: ChatroomType): SearchableOption {
  return {
    value: room.chatroomId,
    label: room.name
  };
}

type BrowseChatroomDialogProps = Readonly<{
  classes: any;
  theme: ChatTheme;
  open: boolean;
  fullScreen: boolean;
  onClose: () => void;
}>;

/**
 * Dialog for browsing and joining chatrooms.
 * @param BrowseChatroomDialogProps
 */
function BrowseChatroomDialog({
  classes,
  theme,
  open,
  fullScreen,
  onClose
}: BrowseChatroomDialogProps) {
  const chatApi = useChatApi();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = useUserLogin();
  const { rooms, status: roomsStatus, retry: retryRooms } = useFetchRooms(
    nonUserRoomsPredicate
  );
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [joinButtonText, setJoinButtonText] = useState('Join Chatroom');

  const [joinPending, setJoinPending] = useState(false);
  const [joinError, setJoinError] = useState(false);

  const searchableRooms: SearchableOption[] = rooms.map(createSearchableRoom);

  useEffect(
    function updateJoinButtonText() {
      if (joinError) {
        setJoinButtonText('Retry');
      } else if (selectedRooms.length > 1) {
        setJoinButtonText('Join Chatrooms');
      } else {
        setJoinButtonText('Join Chatroom');
      }
    },
    [selectedRooms, joinError, setJoinButtonText]
  );

  function nonUserRoomsPredicate({ memberIds = [] }: ChatroomType): boolean {
    return !memberIds.includes(user.userId);
  }

  function handleSelectedRoomsChange(updatedRooms: SearchableOption[]) {
    setSelectedRooms(updatedRooms || []);
  }

  async function handleJoinChatrooms() {
    setJoinPending(true);
    const chatroomIds = selectedRooms.map(
      (room: SearchableOption) => room.value
    );
    try {
      await chatApi.joinChatrooms(chatroomIds, user.userId);
      showJoinSuccessSnackbar(chatroomIds);
      setJoinPending(false);
      onClose();
    } catch (err) {
      setJoinError(true);
      setJoinPending(false);
    }
  }

  function showJoinSuccessSnackbar(chatroomIds: string[]) {
    const message =
      chatroomIds.length > 1 ? 'Joined Chatrooms!' : 'Joined Chatroom!';

    const closeFragment = (snackbarKey: OptionsObject['key']) => (
      <IconButton key="close" onClick={() => closeSnackbar(snackbarKey)}>
        <Close />
      </IconButton>
    );
    const messageFragment = <Typography>{message}</Typography>;
    const snackbarConfig: OptionsObject = {
      variant: 'success',
      action: closeFragment,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
      }
    };
    enqueueSnackbar(messageFragment, snackbarConfig);
  }

  // TODO type this properly
  const joinButtonFragment: any = (
    <Button
      variant="contained"
      disabled={!selectedRooms.length || joinPending}
      onClick={handleJoinChatrooms}
      color="secondary"
    >
      {joinButtonText}
    </Button>
  );

  const loadingRoomsFragment = (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <div className={classes.loading} />
    </Fade>
  );

  const loadingRoomsErrorFragment = (
    <Fade in={true} timeout={theme.transitions.duration.enteringScreen}>
      <Typography className={classes.loadingFailedContainer} color="inherit">
        Failed to load chatrooms!
        <Button
          className={classes.retryButton}
          color="secondary"
          disabled={status === fetchRoomsStatus.FETCHING}
          onClick={retryRooms}
        >
          Retry
        </Button>
      </Typography>
    </Fade>
  );

  return (
    <Dialog fullWidth fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle id="browse-dialog-title">Join Chatrooms</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a Chatroom below. Start typing to narrow down the chatrooms.
        </DialogContentText>

        <div className={classes.browseChatroomElement}>
          {roomsStatus === fetchRoomsStatus.FETCHING && loadingRoomsFragment}

          {roomsStatus === fetchRoomsStatus.SUCCESS && (
            <SearchableSelect
              label="Chatrooms *"
              options={searchableRooms}
              selectedOptions={selectedRooms}
              onSelectedOptionsChange={handleSelectedRoomsChange}
            />
          )}

          {roomsStatus === fetchRoomsStatus.ERROR && loadingRoomsErrorFragment}

          <ErrorMessage
            errorMessage="Error: Failed to join chatrooms!"
            showError={joinError}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Cancel
        </Button>

        <PendingButton button={joinButtonFragment} pending={joinPending} />
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog({ breakpoint: 'xs' })(
  withStyles(styles, { withTheme: true })(BrowseChatroomDialog)
);
