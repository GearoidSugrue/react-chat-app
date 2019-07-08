export type ChatroomType = Readonly<{
  name: string;
  chatroomId: string;
  messages: any[]; // TODO add Message type
  memberIds: string[];
}>;
