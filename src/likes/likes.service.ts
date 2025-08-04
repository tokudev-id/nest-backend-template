import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Like } from './like.entity';
import { Article } from 'src/articles/article.entity';
import { User } from 'src/users/user.entity';
import { ErrorService } from 'src/common/services/error.service';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private errorService: ErrorService,
  ) {}

  async likeArticle(articleId: number, userId: number) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId },
    });
    if (!article) {
      this.errorService.throwNotFound('Article not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.errorService.throwNotFound('User not found');
    }

    // Check if already liked
    const existingLike = await this.likeRepo.findOne({
      where: { article: { id: articleId }, user: { id: userId } },
    });

    if (existingLike) {
      this.errorService.throwConflict('Article already liked');
    }

    const like = this.likeRepo.create({
      article,
      user,
    });

    return this.likeRepo.save(like);
  }

  async unlikeArticle(articleId: number, userId: number) {
    const like = await this.likeRepo.findOne({
      where: { article: { id: articleId }, user: { id: userId } },
    });

    if (!like) {
      this.errorService.throwNotFound('Like not found');
    }

    await this.likeRepo.remove(like);
    return { message: 'Article unliked successfully' };
  }

  async getLikesCount(articleId: number) {
    const count = await this.likeRepo.count({
      where: { article: { id: articleId } },
    });
    return { likesCount: count };
  }

  async isLikedByUser(articleId: number, userId: number) {
    const like = await this.likeRepo.findOne({
      where: { article: { id: articleId }, user: { id: userId } },
    });
    const isLiked = !!like;
    this.logger.log(
      `📊 User ${userId} ${isLiked ? 'has' : 'has not'} liked article ${articleId}`,
    );
    return { isLiked };
  }

  async getLikesCounts(articleIds: number[]): Promise<Record<number, number>> {
    if (!articleIds.length) return {};
    const results = await this.likeRepo
      .createQueryBuilder('like')
      .select('like.articleId', 'articleId')
      .addSelect('COUNT(like.id)', 'count')
      .where('like.articleId IN (:...articleIds)', { articleIds })
      .groupBy('like.articleId')
      .getRawMany();

    return results.reduce<Record<number, number>>(
      (acc, { articleId, count }: { articleId: number; count: string }) => {
        acc[articleId] = Number(count);
        return acc;
      },
      {},
    );
  }

  // Get like statuses for a user across multiple articles
  async getLikeStatuses(
    articleIds: number[],
    userId: number,
  ): Promise<Record<number, boolean>> {
    if (!articleIds.length) return {};
    const likes = await this.likeRepo.find({
      where: {
        article: { id: In(articleIds) },
        user: { id: userId },
      },
      select: ['article'],
      relations: ['article'],
    });
    console.log(likes);
    const likedArticleIds = new Set(likes.map((like) => like.article.id));
    return articleIds.reduce((acc, id) => {
      acc[id] = likedArticleIds.has(id);
      return acc;
    }, {});
  }
}
