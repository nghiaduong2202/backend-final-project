import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActivePeopleData } from '../interfaces/active-people-data.interface';

export const ActivePeople = createParamDecorator(
  (field: keyof ActivePeopleData, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<{ people: ActivePeopleData }>();
    const people: ActivePeopleData = request['people'];

    return field ? people?.[field] : people;
  },
);
