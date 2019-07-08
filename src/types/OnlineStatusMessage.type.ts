/**
 * Event emitted when a user's online status changes.
 */
export type OnlineStatusMessage = Readonly<{
  userId: string;
  online: boolean;
}>;
