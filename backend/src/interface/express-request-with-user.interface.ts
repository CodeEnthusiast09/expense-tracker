import { Request } from 'express';
import { PayloadType } from './payload-types';

export interface RequestWithUser extends Request {
  user: PayloadType;
}
