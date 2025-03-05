import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';
import { AdminGuard } from './admin.guard';
import { OwnerGuard } from './owner.guard';
import { PlayerGuard } from './player.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  private static readonly defaultRole = RoleEnum.ADMIN;

  private readonly roleGuardMap: Record<RoleEnum, CanActivate> = {
    [RoleEnum.NONE]: { canActivate: () => true },
    [RoleEnum.ADMIN]: this.adminGuard,
    [RoleEnum.OWNER]: this.ownerGuard,
    [RoleEnum.PLAYER]: this.playerGuard,
  };

  constructor(
    /**
     * Inject AdminGuard
     */
    private readonly adminGuard: AdminGuard,
    /**
     * Inject OwnerGuard
     */
    private readonly ownerGuard: OwnerGuard,
    /**
     * Inject PlayerGuard
     */
    private readonly playerGuard: PlayerGuard,
    /**
     * Inject Reflector
     */
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]) || [RoleGuard.defaultRole];

    const guards = roles.map((role) => this.roleGuardMap[role]).flat();

    for (const instance of guards) {
      const canActivate = await instance.canActivate(context);

      if (canActivate) {
        return true;
      }
    }

    throw new UnauthorizedException();
  }
}
