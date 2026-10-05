import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE_ADMIN, ROLE_EMPLOYEE } from '@app/constants/role.constants';
import { RolesGuard } from '@app/modules/auth/guards/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createContext = (user?: { role?: string }): ExecutionContext =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow the request when no roles are required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow the request when the user has a required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      ROLE_ADMIN,
      ROLE_EMPLOYEE,
    ]);

    expect(
      guard.canActivate(createContext({ role: ROLE_EMPLOYEE })),
    ).toBe(true);
  });

  it('should throw ForbiddenException when the user role is not allowed', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([ROLE_ADMIN]);

    expect(() =>
      guard.canActivate(createContext({ role: ROLE_EMPLOYEE })),
    ).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when there is no authenticated user', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([ROLE_ADMIN]);

    expect(() => guard.canActivate(createContext())).toThrow(
      ForbiddenException,
    );
  });
});
