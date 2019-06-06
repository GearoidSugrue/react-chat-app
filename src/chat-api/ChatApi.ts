import { fromEvent, Observable } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';

import { Chatroom } from 'src/types/Chatroom.type';
import { User } from 'src/types/User.type';

export class ChatApi {
  // todo create enums for ChatEvent
  // todo create types
  chatroomsUpdates$: Observable<any>;
  usersUpdates$: Observable<any>;
  messages$: Observable<any>;
  onlineStatusUpdates$: Observable<any>;

  constructor(private socket) {
    console.log('socket constructor', socket);

    this.chatroomsUpdates$ = fromEvent(socket, 'rooms updated');
    this.usersUpdates$ = fromEvent(socket, 'users updated');
    // this.newUsers$ = fromEvent(socket, 'new users');

    this.messages$ = fromEvent(socket, 'message').pipe(
      tap(message => console.log('New message received:', message)),
      share()
    );
    this.onlineStatusUpdates$ = fromEvent(socket, 'online status change').pipe(
      tap(user => console.log('User online status change...', user)),
      share()
    );
  }

  login({ userId }) {
    console.log('ChatAPI - login', { userId });

    if (userId) {
      this.socket.emit('login', { userId });
    }
  }

  logout() {
    console.log('ChatAPI - logout');
    this.socket.emit('logout');
  }

  sendMessageToChatroom({ chatroomId, userId, message }) {
    console.log('ChatAPI - sendMessageToChatroom', {
      chatroomId,
      userId,
      message
    });
    this.socket.emit('new message to chatroom', {
      chatroomId,
      userId,
      message
    });
  }

  sendMessageToUser({ toUserId, message }) {
    console.log('ChatAPI - sendMessageToUser', {
      toUserId,
      message
    });
    this.socket.emit('new message to user', { toUserId, message });
  }

  // todo rework needed here?
  joinChatroom({ chatroomId, userId }) {
    console.log('joinChatroom', { chatroomId, userId });

    const validJoin = userId && chatroomId;

    if (validJoin) {
      this.socket.emit('join chatroom', {
        chatroomId,
        userId
      });
    }
  }

  leaveChatroom({ chatroomId, userId }) {
    console.log('leaveChatroom', { chatroomId, userId });

    const validLeave = userId && chatroomId;

    if (validLeave) {
      this.socket.emit('leave chatroom', {
        chatroomId,
        userId
      });
    }
  }

  listenForChatroomMessages(selectedChatroomId: string): Observable<any> {
    const correctChatroom = ({ chatroomId }: Chatroom) =>
      chatroomId === selectedChatroomId;
    return this.messages$.pipe(filter(correctChatroom));
  }

  listenForUserMessages(selectedUserId: string): Observable<any> {
    const correctUser = ({ userId }: User) => userId === selectedUserId;
    return this.messages$.pipe(filter(correctUser));
  }

  chatroomNotifications$({ chatroomId }) {
    console.log('chatroomNotifications', { chatroomId });
    const correctChatroom = newMessage => newMessage.chatroomId === chatroomId;
    return this.messages$.pipe(filter(correctChatroom));
  }

  userNotifications$({ fromUserId }) {
    console.log('userNotifications', { fromUserId });
    const correctUser = newMessage => newMessage.fromUserId === fromUserId;
    return this.messages$.pipe(filter(correctUser));
  }

  userOnlineStatus$({ userId }): Observable<boolean> {
    console.log('userOnlineStatus', { userId });
    const correctUser = statusUpdate => statusUpdate.userId === userId;

    return this.onlineStatusUpdates$.pipe(
      filter(correctUser),
      map(user => user.online)
    );
  }
}
