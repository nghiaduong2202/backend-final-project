import { UUID } from 'crypto';

export interface ActivePeopleData {
  /**
   * id
   */
  sub: UUID;

  /**
   * role
   */
  role: string;
}
