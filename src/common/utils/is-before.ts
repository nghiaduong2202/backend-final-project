import { BadRequestException } from '@nestjs/common';

export function isBefore(time1: string, time2: string, message: string) {
  if (!(new Date(`1970-01-01T${time1}Z`) < new Date(`1970-01-01T${time2}Z`))) {
    throw new BadRequestException(message);
  }
}
