export type ChatroomType = Readonly<{
  name: string;
  chatroomId: string;
  messages: any[]; // todo add Message type
  memberIds: string[];
}>;
