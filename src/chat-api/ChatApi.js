// todo add ChatApi class

import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class ChatApi {
  constructor(socket) {
    console.log('socket constructor', socket);

    this.socket = socket;
    this.chatroomsUpdates$ = fromEvent(socket, 'rooms updated');
    this.usersUpdates$ = fromEvent(socket, 'users updated');
    // this.newUsers$ = fromEvent(socket, 'new users');

    this.messages$ = fromEvent(socket, 'message');
    this.onlineStatusUpdates$ = fromEvent(socket, 'online status change');
  }

  login({ username }) {
    console.log('ChatAPI - login', { username });

    if (username) {
      this.socket.emit('login', { username });
    }
  }

  logout() {
    console.log('ChatAPI - logout');
    this.socket.emit('logout');
  }

  sendMessageToChatroom({ chatroom, username, message }) {
    console.log('ChatAPI - sendMessageToChatroom', {
      chatroom,
      username,
      message
    });
    this.socket.emit('new message to chatroom', {
      chatroom,
      username,
      message
    });
  }

  sendMessageToUser({ toUsername, username, message }) {
    console.log('ChatAPI - sendMessageToUser', {
      toUsername,
      username,
      message
    });
    this.socket.emit('new message to user', { toUsername, username, message });
  }

  // todo rework needed here?
  joinChatroom({ chatroom, username }) {
    console.log('joinChatroom', { chatroom, username });

    const validJoin = username && chatroom;

    if (validJoin) {
      this.socket.emit('join chatroom', {
        chatroom,
        username
      });
    }
  }

  leaveChatroom({ chatroom, username }) {
    console.log('leaveChatroom', { chatroom, username });

    const validLeave = username && chatroom;

    if (validLeave) {
      this.socket.emit('leave chatroom', {
        chatroom,
        username
      });
    }
  }

  chatroomNotifications$({ chatroom }) {
    console.log('chatroomNotifications', { chatroom });
    const correctChatroom = newMessage => newMessage.chatroom === chatroom;
    return this.messages.pipe(filter(correctChatroom));
  }

  userNotifications$({ fromUsername }) {
    console.log('userNotifications', { fromUsername });
    const correctUser = newMessage => newMessage.fromUsername === fromUsername;
    return this.messages.pipe(filter(correctUser));
  }

  // todo this could probably be a custom hook: useOnlineStatus(username)
  userOnlineStatus$({ username }) {
    console.log('userOnlineStatus', { username });
    const correctUser = statusUpdate => statusUpdate.username === username;

    return this.onlineStatusUpdates$.pipe(
      filter(correctUser),
      map(user => user.online)
    );
  }
}
