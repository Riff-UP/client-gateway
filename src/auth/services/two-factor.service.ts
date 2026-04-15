import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  createHash,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from 'crypto';
import { createClient, RedisClientType } from 'redis';
import { authenticator } from '@otplib/preset-default';
import { envs } from '../../config/index.js';

type AuthUser = {
  id?: string;
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  googleId?: string;
  picture?: string;
};

type PendingLoginData = {
  userId: string;
  token: string;
  user: AuthUser;
  attempts: number;
};

type TwoFactorConfig = {
  enabled: boolean;
  encryptedSecret: string;
};

@Injectable()
export class TwoFactorService {
  private readonly redis: RedisClientType;

  constructor(private readonly jwtService: JwtService) {
    this.redis = createClient({
      url: envs.redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            return false;
          }
          return Math.min(retries * 100, 2000);
        },
      },
    });
  }

  private get encryptionKey(): Buffer {
    return createHash('sha256').update(envs.twoFactorEncryptionKey).digest();
  }

  private get tempTokenSecret(): string {
    return createHash('sha256')
      .update(`${envs.jwtSecret}:${envs.twoFactorEncryptionKey}`)
      .digest('hex');
  }

  private userConfigKey(userId: string): string {
    return `auth:2fa:config:${userId}`;
  }

  private setupKey(userId: string): string {
    return `auth:2fa:setup:${userId}`;
  }

  private pendingKey(challengeId: string): string {
    return `auth:2fa:pending:${challengeId}`;
  }

  private async ensureRedisConnection(): Promise<void> {
    if (!this.redis.isOpen) {
      await this.redis.connect();
    }
  }

  private encryptSecret(secret: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(secret, 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
  }

  private decryptSecret(encryptedSecret: string): string {
    const [ivB64, tagB64, dataB64] = encryptedSecret.split('.');

    if (!ivB64 || !tagB64 || !dataB64) {
      throw new InternalServerErrorException('2FA secret malformed');
    }

    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(tag);

    const plain = Buffer.concat([decipher.update(data), decipher.final()]);
    return plain.toString('utf8');
  }

  private async getConfig(userId: string): Promise<TwoFactorConfig | null> {
    await this.ensureRedisConnection();
    const raw = await this.redis.get(this.userConfigKey(userId));
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as TwoFactorConfig;
  }

  async isEnabled(userId: string): Promise<boolean> {
    const config = await this.getConfig(userId);
    return Boolean(config?.enabled);
  }

  async createSetup(userId: string, email: string) {
    await this.ensureRedisConnection();

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      email,
      envs.twoFactorIssuer,
      secret,
    );
    const qrImageUrl =
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' +
      encodeURIComponent(otpauthUrl);

    await this.redis.set(this.setupKey(userId), secret, {
      EX: envs.twoFactorSetupTtlSeconds,
    });

    return {
      issuer: envs.twoFactorIssuer,
      manualEntryKey: secret,
      otpauthUrl,
      qrImageUrl,
      qrDataUrl: qrImageUrl,
      expiresInSeconds: envs.twoFactorSetupTtlSeconds,
    };
  }

  async enableWithCode(userId: string, code: string) {
    await this.ensureRedisConnection();

    const secret = await this.redis.get(this.setupKey(userId));
    if (!secret) {
      throw new UnauthorizedException(
        'No 2FA setup pending. Start setup again.',
      );
    }

    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    const encryptedSecret = this.encryptSecret(secret);
    const payload: TwoFactorConfig = {
      enabled: true,
      encryptedSecret,
    };

    await this.redis.set(this.userConfigKey(userId), JSON.stringify(payload));
    await this.redis.del(this.setupKey(userId));

    return { enabled: true };
  }

  async disableWithCode(userId: string, code: string) {
    const secret = await this.getDecryptedSecret(userId);
    if (!secret) {
      return { enabled: false };
    }

    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.ensureRedisConnection();
    await this.redis.del(this.userConfigKey(userId));

    return { enabled: false };
  }

  async getDecryptedSecret(userId: string): Promise<string | null> {
    const config = await this.getConfig(userId);
    if (!config?.enabled || !config.encryptedSecret) {
      return null;
    }

    return this.decryptSecret(config.encryptedSecret);
  }

  async createPendingLogin(user: AuthUser, token: string): Promise<string> {
    await this.ensureRedisConnection();

    const userId = String(user?.id ?? user?.userId ?? '');
    if (!userId) {
      throw new InternalServerErrorException(
        'Missing user id for 2FA challenge',
      );
    }

    const challengeId = randomUUID();
    const pendingData: PendingLoginData = {
      userId,
      token,
      user,
      attempts: 0,
    };

    await this.redis.set(
      this.pendingKey(challengeId),
      JSON.stringify(pendingData),
      {
        EX: envs.twoFactorTempTokenTtlSeconds,
      },
    );

    return this.jwtService.sign(
      {
        typ: '2fa-login',
        sub: userId,
        challengeId,
      },
      {
        secret: this.tempTokenSecret,
        expiresIn: `${envs.twoFactorTempTokenTtlSeconds}s`,
      },
    );
  }

  async consumePendingLogin(tempToken: string, code: string) {
    await this.ensureRedisConnection();

    let decoded: { typ?: string; sub?: string; challengeId?: string };
    try {
      decoded = await this.jwtService.verifyAsync(tempToken, {
        secret: this.tempTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired 2FA temporary token');
    }

    if (decoded.typ !== '2fa-login' || !decoded.challengeId || !decoded.sub) {
      throw new UnauthorizedException('Malformed 2FA temporary token');
    }

    const key = this.pendingKey(decoded.challengeId);
    const pendingRaw = await this.redis.get(key);

    if (!pendingRaw) {
      throw new UnauthorizedException('2FA challenge expired or already used');
    }

    const pending = JSON.parse(pendingRaw) as PendingLoginData;
    if (!pending?.userId || pending.userId !== decoded.sub) {
      await this.redis.del(key);
      throw new UnauthorizedException('2FA challenge mismatch');
    }

    if (pending.attempts >= 5) {
      await this.redis.del(key);
      throw new UnauthorizedException(
        '2FA challenge blocked by too many attempts',
      );
    }

    const secret = await this.getDecryptedSecret(pending.userId);
    if (!secret) {
      await this.redis.del(key);
      throw new UnauthorizedException('2FA is not configured for this account');
    }

    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) {
      pending.attempts += 1;
      const ttl = await this.redis.ttl(key);
      if (ttl > 0) {
        await this.redis.set(key, JSON.stringify(pending), { EX: ttl });
      } else {
        await this.redis.set(key, JSON.stringify(pending), {
          EX: envs.twoFactorTempTokenTtlSeconds,
        });
      }
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.redis.del(key);

    return {
      token: pending.token,
      user: pending.user,
    };
  }
}
