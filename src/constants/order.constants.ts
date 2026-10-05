export const ORDER_STATUS_VALUES = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
] as const;

export const PAYMENT_STATUS_PAID = 'PAID';

export const PAYMENT_STATUS_VALUES = [
  'PENDING',
  PAYMENT_STATUS_PAID,
  'FAILED',
  'REFUNDED',
] as const;