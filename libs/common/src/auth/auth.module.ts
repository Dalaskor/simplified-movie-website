import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RmqModule } from '../rmq/rmq.module';
import { AUTH_SERVICE } from './service';
import * as cookieParser from 'cookie-parser';
import { GoogleStrategy } from './google.strategy';

@Module({
    imports: [RmqModule.register({ name: AUTH_SERVICE })],
    exports: [RmqModule],
    providers: [GoogleStrategy],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');
    }
}
