import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import differenceInMinutes from 'date-fns/difference_in_minutes';

import { Message } from 'src/types';

const MAX_TIME_DIFFERENCE_MINS = 5; // Max time allowed before a new message from the same user isn't grouped with the previous message
const DATE_FORMAT = 'MMMM Do, YYYY'; // e.g. June 6th, 2019
const TIME_FORMAT = 'HH:mm A'; // e.g. 14:18 PM

export function shouldMessageBeGrouped(
  curIndex: number,
  prevIndex: number,
  messages: Message[]
): boolean {
  if (prevIndex < 0) {
    return false;
  }

  const { userId: curUserId, timestamp: curTimestamp } = messages[curIndex];
  const { userId: prevUserId, timestamp: prevTimestamp } = messages[prevIndex];

  if (curUserId !== prevUserId) {
    return false;
  }

  const timeDifference = differenceInMinutes(curTimestamp, prevTimestamp);
  return timeDifference < MAX_TIME_DIFFERENCE_MINS;
}

export function shouldDisplayDateHeader(
  curIndex: number,
  prevIndex: number,
  messages: Message[]
): boolean {
  if (prevIndex < 0) {
    return true;
  }

  const { timestamp: prevTimestamp } = messages[prevIndex];
  const { timestamp: curTimestamp } = messages[curIndex];

  return !isSameDay(prevTimestamp, curTimestamp);
}

export function getDateHeaderText(timestamp: string): string {
  if (isToday(timestamp)) {
    return 'Today';
  } else if (isYesterday(timestamp)) {
    return 'Yesterday';
  } else {
    return format(timestamp, DATE_FORMAT);
  }
}

export function getTimeText(timestamp: string): string {
  return format(timestamp, TIME_FORMAT);
}
