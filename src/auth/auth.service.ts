import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ExternalRegisterDto } from './dto/external-register.dto';
import { User } from '../users/user.entity';
import { ErrorService } from '../common/services/error.service';
import {
  ExternalProviderService,
  ExternalUserInfo,
} from './external-provider.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private errorService: ErrorService,
    private externalProviderService: ExternalProviderService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      this.errorService.throwConflict('Email already registered');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: hash,
      profilePictureUrl: dto.profilePictureUrl,
    });
    await this.userRepository.save(user);

    return null;
  }

  async externalRegister(dto: ExternalRegisterDto) {
    try {
      // Get user info from external provider
      const externalUserInfo: ExternalUserInfo =
        await this.externalProviderService.getUserInfo(
          dto.provider,
          dto.accessToken,
        );
      if (!externalUserInfo) {
        this.errorService.throwUnauthorized('Invalid access token');
      }
      // Check if user already exists with this email
      const existingUser = await this.userRepository.findOne({
        where: { email: externalUserInfo.email },
      });

      if (existingUser) {
        // If user exists but doesn't have external account linked, link it
        if (!existingUser.externalAccountId) {
          existingUser.externalAccountId = externalUserInfo.id;
          existingUser.externalProvider = dto.provider;
          if (externalUserInfo.profilePictureUrl) {
            existingUser.profilePictureUrl = externalUserInfo.profilePictureUrl;
          }
          await this.userRepository.save(existingUser);
        }

        // Generate JWT token for existing user
        const payload = { sub: existingUser.id, email: existingUser.email };
        const token = this.jwtService.sign(payload);

        return { access_token: token };
      }

      // Check if user exists with this external account ID
      const existingExternalUser = await this.userRepository.findOne({
        where: {
          externalAccountId: externalUserInfo.id,
          externalProvider: dto.provider,
        },
      });

      if (existingExternalUser) {
        const payload = {
          sub: existingExternalUser.id,
          email: existingExternalUser.email,
        };
        const token = this.jwtService.sign(payload);

        return { access_token: token };
      }

      // Create new user with external account
      const user = this.userRepository.create({
        email: externalUserInfo.email,
        name: externalUserInfo.name,
        profilePictureUrl: externalUserInfo.profilePictureUrl,
        externalAccountId: externalUserInfo.id,
        externalProvider: dto.provider,
      });

      await this.userRepository.save(user);

      // Generate JWT token for new user
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return { access_token: token };
    } catch (error: any) {
      // Re-throw the error if it's already an HttpException
      if (error.status) {
        throw error;
      }
      // Otherwise, throw a generic error
      this.errorService.throwInternalServerError(
        'External registration failed',
      );
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      this.errorService.throwUnauthorized('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
