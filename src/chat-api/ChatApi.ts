import axios, { AxiosRequestConfig } from 'axios';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';

import {
  ChatroomType,
  Message,
  OnlineStatusMessage,
  TypingChange,
  UserType
} from 'src/types';

export enum ChatEvent {
  ONLINE_STATUS_CHANGE = 'online status change',
  NEW_USER = 'users updated',
  NEW_CHATROOM = 'new chatroom',
  CHATROOM_TYPING_CHANGE = 'typing in chatroom change',
  DIRECT_TYPING_CHANGE = 'direct typing change'
}

export enum SendChatEvent {
  MESSAGE_TO_CHATROOM = 'new message to chatroom',
  MESSAGE_TO_USER = 'new message to user',
  TYPING_IN_CHATROOM = 'typing in chatroom',
  TYPING_DIRECT = 'typing direct'
}

/**
 * A class that wraps socketIO and POST/PUT http requests for the chat app.
 *
 * Socket events are converted to Observables which allow hooks and components to subscribe to updates.
 */
export class ChatApi {
  HOST: string = process.env.REACT_APP_API_HOST;

  loggedInUser$: BehaviorSubject<UserType>;

  newChatroom$: Observable<ChatroomType>;
  usersUpdates$: Observable<any>;
  messages$: Observable<Message>;
  onlineStatusUpdates$: Observable<OnlineStatusMessage>;

  chatroomTypingUpdate$: Observable<TypingChange>;
  directTypingUpdate$: Observable<TypingChange>;

  constructor(private socket) {
    console.log('socket constructor', socket);

    this.loggedInUser$ = new BehaviorSubject({} as UserType);

    this.newChatroom$ = fromEvent<ChatroomType>(
      socket,
      ChatEvent.NEW_CHATROOM
    ).pipe(
      tap(chatroom => console.log('New chatroom received:', chatroom)),
      share()
    );
    this.usersUpdates$ = fromEvent(socket, ChatEvent.NEW_USER);
    // this.newUsers$ = fromEvent(socket, 'new users');

    this.messages$ = fromEvent<Message>(socket, 'message').pipe(
      tap(message => console.log('New message received:', message)),
      share()
    );

    this.onlineStatusUpdates$ = fromEvent(
      socket,
      ChatEvent.ONLINE_STATUS_CHANGE
    ).pipe(
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
    const { userId, username } = user || ({} as UserType);

    if (userId && username) {
      this.socket.emit('login', { userId, username });
      this.loggedInUser$.next(user);
    }
  }

  logout() {
    this.socket.emit('logout');
    this.loggedInUser$.next({} as UserType);
  }

  async createChatroom(
    chatroomName: string,
    memberIds: string[],
    userId: string
  ): Promise<ChatroomType> {
    try {
      const createRoomConfig: AxiosRequestConfig = {
        url: `http://${this.HOST}/rooms`,
        method: 'POST',
        data: {
          memberIds,
          name: chatroomName
        },
        headers: {
          RequesterUserId: userId
        }
      };
      const result = await axios(createRoomConfig);
      return result.data;
    } catch (error) {
      console.error('Error occurred creating room', error);
      throw error;
    }
  }

  async joinChatrooms(
    chatroomIds: string[],
    userId: string
  ): Promise<string[]> {
    try {
      const joinRoomConfig: AxiosRequestConfig = {
        url: `http://${this.HOST}/users/${userId}/rooms`,
        method: 'PUT',
        data: {
          chatroomIds
        },
        headers: {
          RequesterUserId: userId
        }
      };
      await axios(joinRoomConfig);
      return chatroomIds;
    } catch (error) {
      console.error('Error occurred joining rooms', chatroomIds, error);
      throw error;
    }
  }

  sendMessageToChatroom({ chatroomId, userId, message }) {
    console.log('ChatAPI - sendMessageToChatroom', {
      chatroomId,
      userId,
      message
    });
    this.socket.emit(SendChatEvent.MESSAGE_TO_CHATROOM, {
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
    this.socket.emit(SendChatEvent.MESSAGE_TO_USER, { toUserId, message });
  }

  sendTypingInChatroomChange(toChatroomId: string, typing: boolean) {
    console.log('ChatAPI - sendTypingInChatroomChange', {
      toChatroomId,
      typing
    });
    this.socket.emit(SendChatEvent.TYPING_IN_CHATROOM, {
      toChatroomId,
      typing
    });
  }

  sendTypingDirectChange(toUserId: string, typing: boolean) {
    console.log('ChatAPI - sendTypingDirectChange', {
      toUserId,
      typing
    });
    this.socket.emit(SendChatEvent.TYPING_DIRECT, {
      toUserId,
      typing
    });
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
      message.userId === fromUserId;
    const isToLoggedInUser = (message: Message) =>
      message.toUserId === loggedInUserId;

    const filterMessage = (message: Message) =>
      isFromCorrectUser(message) && isToLoggedInUser(message);

    return this.messages$.pipe(filter(filterMessage));
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

  listenForChatroomTypingChange$(
    fromUserId: string,
    toChatroomId: string
  ): Observable<TypingChange> {
    const correctUserAndChatroom = (typingUpdate: TypingChange) =>
      typingUpdate.toChatroomId === toChatroomId &&
      typingUpdate.userId === fromUserId;

    return this.chatroomTypingUpdate$.pipe(filter(correctUserAndChatroom));
  }

  listenForDirectTypingChange$(
    fromUserId: string,
    toUserId: string
  ): Observable<TypingChange> {
    const correctUser = (typingUpdate: TypingChange) =>
      typingUpdate.userId === fromUserId && typingUpdate.toUserId === toUserId;

    return this.directTypingUpdate$.pipe(filter(correctUser));
  }
}
