import { BadRequestException, Injectable } from '@nestjs/common';
import { PeopleService } from 'src/people/people.service';
import { RegisterDto } from '../dtos/register.dto';
import { HashProvider } from './hash.provider';

@Injectable()
export class RegisterProvider {
  constructor(
    /**
     * Inject PeopleService
     */
    private readonly peopleService: PeopleService,
    /**
     * Inject HashProvider
     */
    private readonly hashProvider: HashProvider,
  ) {}

  public async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.retypePassword) {
      throw new BadRequestException('password and retype password not match');
    }

    const hashPassowrd = await this.hashProvider.hashPassword(
      registerDto.password,
    );

    registerDto.password = hashPassowrd;

    await this.peopleService.createUser(registerDto);

    return {
      message: 'create successful',
    };
  }
}
