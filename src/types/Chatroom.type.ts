export type Chatroom = Readonly<{
  name: string;
  chatroomId: string;
  messages: any[]; // todo add Message type
}>;
