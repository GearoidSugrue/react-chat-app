export type TypingChange = Readonly<{
  typing: boolean;
  userId: string;
  username: string;
  toUserId?: string;
  toChatroomId?: string;
}>;
