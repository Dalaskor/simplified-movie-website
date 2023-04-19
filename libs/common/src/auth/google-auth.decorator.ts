import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES } from '../constants/strategies';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(STRATEGIES.GOOGLE) {}
