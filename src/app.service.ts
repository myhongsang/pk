import { Injectable } from '@nestjs/common';

import { APP_HELLO_MESSAGE } from './constants/app.constants';

@Injectable()
export class AppService {
  getHello(): string {
    return APP_HELLO_MESSAGE;
  }
}
