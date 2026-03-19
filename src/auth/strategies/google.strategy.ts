import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { envs } from '../../config/index.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: envs.googleClientId,
      clientSecret: envs.googleClientSecret,
      callbackURL: envs.googleCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const normalizedEmail = String(emails?.[0]?.value || '')
      .trim()
      .toLowerCase();
    const user = {
      email: normalizedEmail,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      googleId: id,
      accessToken,
    };
    done(null, user);
  }
}
