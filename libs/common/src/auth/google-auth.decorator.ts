import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES } from '../constants/strategies';

export class GoogleAuthGuard extends AuthGuard(STRATEGIES.GOOGLE) {}
