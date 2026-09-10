import * as bcrypt from 'bcrypt';

import { PASSWORD_SALT_ROUNDS } from '@app/constants/password.constants';

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
