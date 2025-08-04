import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ExternalProvider } from '../users/user.entity';

export interface ExternalUserInfo {
  id: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
}

@Injectable()
export class ExternalProviderService {
  async getUserInfo(
    provider: ExternalProvider,
    accessToken: string,
  ): Promise<ExternalUserInfo> {
    switch (provider) {
      case ExternalProvider.TOKU:
        return this.getTokuUserInfo(accessToken);
      case ExternalProvider.GOOGLE:
        return this.getGoogleUserInfo(accessToken);
      case ExternalProvider.FACEBOOK:
        return this.getFacebookUserInfo(accessToken);
      case ExternalProvider.GITHUB:
        return this.getGithubUserInfo(accessToken);
      default:
        throw new HttpException(
          'Unsupported external provider',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  private async getTokuUserInfo(
    accessToken: string,
  ): Promise<ExternalUserInfo> {
    try {
      // Replace with actual Toku API endpoint
      const response = await fetch(
        'https://account.torikul.my.id/api/oauth/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new HttpException(
          'Invalid access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userData = await response.json();
      return {
        id: userData.sub || userData.id, // Use 'sub' field for external account ID
        email: userData.email,
        name: userData.name,
        profilePictureUrl: userData.picture,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get user info from Toku',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getGoogleUserInfo(
    accessToken: string,
  ): Promise<ExternalUserInfo> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new HttpException(
          'Invalid access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userData = await response.json();
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profilePictureUrl: userData.picture,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get user info from Google',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getFacebookUserInfo(
    accessToken: string,
  ): Promise<ExternalUserInfo> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
      );

      if (!response.ok) {
        throw new HttpException(
          'Invalid access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userData = await response.json();

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profilePictureUrl: userData.picture?.data?.url,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get user info from Facebook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getGithubUserInfo(
    accessToken: string,
  ): Promise<ExternalUserInfo> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new HttpException(
          'Invalid access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userData = await response.json();

      return {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.name || userData.login,
        profilePictureUrl: userData.avatar_url,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get user info from GitHub',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
