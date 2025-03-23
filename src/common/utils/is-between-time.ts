import { BadRequestException } from '@nestjs/common';

export function isBetweenTime(
  startTime: string,
  endTime: string,
  openTime: string,
  closeTime: string,
  message: string,
) {
  const start = new Date(`1970-01-01T${startTime}Z`).valueOf();
  const end = new Date(`1970-01-01T${endTime}Z`).valueOf();
  const open = new Date(`1970-01-01T${openTime}Z`).valueOf();
  const close = new Date(`1970-01-01T${closeTime}Z`).valueOf();

  if (!(open <= start && end <= close)) {
    throw new BadRequestException(message);
  }
}
