import { Injectable } from '@nestjs/common';
import { AxiosProxy } from 'src/lib';

@Injectable()
export class UserProxyService extends AxiosProxy {
  constructor() {
    super(`${process.env.SERVICE_PROTOCOL}://${process.env.ATLAS_HOST}:${process.env.ATLAS_PORT}`);
  }
}