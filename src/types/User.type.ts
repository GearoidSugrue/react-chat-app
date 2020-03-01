export type UserType = Readonly<{
  isGuestUser: boolean;
  username: string;
  userId: string;
  online: boolean;
  imageUrl?: string;
}>;
