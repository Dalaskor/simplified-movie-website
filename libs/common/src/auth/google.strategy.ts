import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { STRATEGIES } from '../constants/strategies';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, STRATEGIES.GOOGLE) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_SECRET'),
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { emails } = profile;
        const user = {
            email: emails[0].value,
            accessToken,
        };
        done(null, user);
    }
}
