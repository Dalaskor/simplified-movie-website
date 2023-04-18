import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule, RmqModule } from '@app/common';
import { UserModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.stategy';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.string().required(),
                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_SECRET: Joi.string().required(),
            }),
            envFilePath: './apps/auth/.env',
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
                },
            }),
            inject: [ConfigService],
        }),
        DatabaseModule,
        RmqModule,
        UserModule,
        RolesModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
