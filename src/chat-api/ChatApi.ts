import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';

import {
  Message,
  OnlineStatusMessage,
  TypingChange,
  UserType
} from 'src/types';

export enum ChatEvent {
  ONLINE_STATUS_CHANGE = 'online status change',
  NEW_USER = 'users updated',
  NEW_CHATROOM = 'rooms updated',
  CHATROOM_TYPING_CHANGE = 'typing in chatroom change',
  DIRECT_TYPING_CHANGE = 'direct typing change'
}

export class ChatApi {
  // todo create enums for ChatEvent
  // todo create types
  loggedInUser$: BehaviorSubject<UserType>;

  chatroomsUpdates$: Observable<any>;
  usersUpdates$: Observable<any>;
  messages$: Observable<Message>;
  onlineStatusUpdates$: Observable<OnlineStatusMessage>;

  chatroomTypingUpdate$: Observable<TypingChange>;
  directTypingUpdate$: Observable<TypingChange>;

  constructor(private socket) {
    console.log('socket constructor', socket);

    this.loggedInUser$ = new BehaviorSubject({} as UserType);

    this.chatroomsUpdates$ = fromEvent(socket, 'rooms updated');
    this.usersUpdates$ = fromEvent(socket, 'users updated');
    // this.newUsers$ = fromEvent(socket, 'new users');

    this.messages$ = fromEvent(socket, 'message').pipe(
      tap(message => console.log('New message received:', message)),
      share()
    ) as Observable<Message>;

    this.onlineStatusUpdates$ = fromEvent(socket, 'online status change').pipe(
      tap((user: UserType) =>
        console.log('User online status change...', user)
      ),
      share()
    ) as Observable<OnlineStatusMessage>;

    this.chatroomTypingUpdate$ = fromEvent(
      socket,
      ChatEvent.CHATROOM_TYPING_CHANGE
    ).pipe(
      tap((typingUpdate: TypingChange) =>
        console.log('chatroom typing update...', typingUpdate)
      ),
      share()
    ) as Observable<TypingChange>;

    this.directTypingUpdate$ = fromEvent(
      socket,
      ChatEvent.DIRECT_TYPING_CHANGE
    ).pipe(
      tap((typingUpdate: TypingChange) =>
        console.log('direct typing update...', typingUpdate)
      ),
      share()
    ) as Observable<TypingChange>;
  }

  login(user: UserType) {
    console.log('ChatAPI - login', { userId: user.userId });
    const { userId, username } = user || ({} as UserType);

    if (userId && username) {
      this.socket.emit('login', { userId, username });
      this.loggedInUser$.next(user);
    }
  }

  logout() {
    console.log('ChatAPI - logout');
    this.socket.emit('logout');
    this.loggedInUser$.next({} as UserType);
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

  sendTypingInChatroomChange(toChatroomId: string, typing: boolean) {
    console.log('ChatAPI - sendTypingInChatroomChange', {
      toChatroomId,
      typing
    });
    this.socket.emit('typing in chatroom', {
      toChatroomId,
      typing
    });
  }

  sendTypingDirectChange(toUserId: string, typing: boolean) {
    console.log('ChatAPI - sendTypingDirectChange', {
      toUserId,
      typing
    });
    this.socket.emit('typing direct', {
      toUserId,
      typing
    });
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

  listenForChatroomMessages$(selectedChatroomId: string): Observable<any> {
    const correctChatroom = ({ chatroomId }: Message) =>
      chatroomId === selectedChatroomId;
    return this.messages$.pipe(filter(correctChatroom));
  }

  listenForUserMessages({ userId, selectedUserId }): Observable<Message> {
    console.log('listenForUserMessages', { userId, selectedUserId });
    const isFromUser = (message: Message) =>
      message.userId === userId && message.toUserId === selectedUserId;
    const isFromSelectedUser = (message: Message) =>
      message.toUserId === userId && message.userId === selectedUserId;

    const filterMessage = (message: Message) =>
      isFromUser(message) || isFromSelectedUser(message);

    return this.messages$.pipe(filter(filterMessage));
  }

  directUserMessages$(
    loggedInUserId: string,
    fromUserId: string
  ): Observable<Message> {
    console.log('listenForUserMessages', { loggedInUserId, fromUserId });
    const isFromCorrectUser = (message: Message) =>
      message.userId === fromUserId && message.toUserId === loggedInUserId;

    return this.messages$.pipe(filter(isFromCorrectUser));
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
    const correctUser = (onlineStatus: OnlineStatusMessage) =>
      onlineStatus.userId === userId;

    return this.onlineStatusUpdates$.pipe(
      filter(correctUser),
      map(user => user.online)
    );
  }

  listenForChatroomTypingChange$(chatroomId: string): Observable<TypingChange> {
    const correctChatroomId = (typingUpdate: TypingChange) =>
      typingUpdate.toChatroomId === chatroomId;

    return this.chatroomTypingUpdate$.pipe(filter(correctChatroomId));
  }

  listenForDirectTypingChange$(userId: string): Observable<TypingChange> {
    const correctUserId = (typingUpdate: TypingChange) =>
      typingUpdate.userId === userId;

    return this.directTypingUpdate$.pipe(filter(correctUserId));
  }

  listenForDirectTypingChange2$(
    fromUserId: string,
    toUserId: string
  ): Observable<TypingChange> {
    const correctUser = (typingUpdate: TypingChange) =>
      typingUpdate.userId === fromUserId && typingUpdate.toUserId === toUserId;

    return this.directTypingUpdate$.pipe(filter(correctUser));
  }
}
