import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

type GoogleType = {
  id: string;
  emails: { value: string; verified: boolean }[];
  displayName: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `${process.env.GOOGLE_REDIRECT_URL}/auth/gredirect`,
        scope: ['email', 'profile'],
      },
      async (
        _req: Request,
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleType,
        done: VerifyCallback,
      ): Promise<void> => {
        const { id, displayName, emails } = profile;

        const user = {
          id,
          email: emails[0].value,
          nick: displayName,
        };
        done(null, user);
      },
    );
  }
}
