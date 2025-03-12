export function isBefore(time1: string, time2: string): boolean {
  return new Date(`1970-01-01T${time1}Z`) < new Date(`1970-01-01T${time2}Z`);
}
