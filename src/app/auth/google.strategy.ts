// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID:
        '878345667574-sa5uv70sld8eb8o6o1o80q4ufoa0hq7p.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3200/api/auth/callback/google',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      name: displayName,
      photo: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
