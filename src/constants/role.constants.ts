export const ROLE_ADMIN = 'ADMIN';

export const ROLE_EMPLOYEE = 'EMPLOYEE';

export const ROLE_VALUES = [ROLE_ADMIN, ROLE_EMPLOYEE] as const;

export type Role = (typeof ROLE_VALUES)[number];
