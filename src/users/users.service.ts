import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ErrorService } from '../common/services/error.service';
import { Like } from 'src/likes/like.entity';
import { Article } from 'src/articles/article.entity';
import { Comment } from 'src/comments/comment.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private errorService: ErrorService,
  ) {}

  async getUserProfile(
    userId: number | undefined,
  ): Promise<UserProfileResponseDto> {
    if (!userId) {
      this.errorService.throwUnauthorized('User not found');
    }

    // Ambil data user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'name',
        'email',
        'profilePictureUrl',
        'externalAccountId',
        'externalProvider',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      this.errorService.throwNotFound('User not found');
    }

    const [totalComments, totalLikes, totalArticlesPublished]: [
      number,
      number,
      number,
    ] = await Promise.all([
      this.commentRepository.count({
        where: { author: { id: userId } },
      }),
      this.likeRepository.count({
        where: { user: { id: userId } },
      }),
      this.articleRepository.count({
        where: { author: { id: userId }, isPublished: true },
      }),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      externalAccountId: user.externalAccountId,
      externalProvider: user.externalProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalComments: totalComments,
      totalLikes,
      totalArticlesPublished,
    };
  }

  async updateUserProfile(
    userId: number | undefined,
    updateDto: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    if (!userId) {
      this.errorService.throwUnauthorized('User not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.errorService.throwNotFound('User not found');
    }

    // Update only provided fields
    if (updateDto.name !== undefined) {
      user.name = updateDto.name;
    }

    if (updateDto.profilePictureUrl !== undefined) {
      user.profilePictureUrl = updateDto.profilePictureUrl;
    }

    await this.userRepository.save(user);

    // Get updated profile with statistics
    return this.getUserProfile(userId);
  }
}
