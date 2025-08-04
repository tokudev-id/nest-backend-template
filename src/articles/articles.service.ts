import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like as TypeOrmLike } from 'typeorm';
import { Article } from './article.entity';
import { User } from 'src/users/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { LikesService } from 'src/likes/likes.service';
import { ErrorService } from 'src/common/services/error.service';
import { GetPaginatedArticlesDto } from './dto/pagination.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private likesService: LikesService,
    private errorService: ErrorService,
  ) {}

  async create(dto: CreateArticleDto, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.errorService.throwUnauthorized('User not found');
    }
    const article = this.articleRepo.create({ ...dto, author: user });
    return this.articleRepo.save(article);
  }

  async findAll(paginationDto: GetPaginatedArticlesDto, userId?: number) {
    const {
      page = 1,
      limit = 10,
      search,
      country,
      city,
      tags,
      isPublished,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions: Record<string, any> = {};

    if (isPublished !== undefined) {
      whereConditions.isPublished = isPublished;
    }

    if (country) {
      whereConditions.country = TypeOrmLike(`%${country}%`);
    }

    if (city) {
      whereConditions.city = TypeOrmLike(`%${city}%`);
    }

    // Build query builder for complex search
    const queryBuilder = this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    // Add where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Add search functionality
    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.content LIKE :search OR article.summary LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      queryBuilder.andWhere('article.tags && :tags', { tags });
    }

    // Add sorting
    const sortField =
      sortBy === 'likesCount' ? 'article.id' : `article.${sortBy}`;
    queryBuilder.orderBy(sortField, sortOrder);

    // Add pagination
    queryBuilder.skip(skip).take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    if (articles.length === 0) {
      this.errorService.throwNotFound('No articles found');
    }

    // Get like counts and like status for each article
    const articlesWithLikes = await Promise.all(
      articles.map(async (article) => {
        const likesCount = await this.likesService.getLikesCount(article.id);
        let isLiked = false;

        if (userId) {
          const likeStatus = await this.likesService.isLikedByUser(
            article.id,
            userId,
          );
          isLiked = likeStatus.isLiked;
        }

        return {
          ...article,
          author: {
            id: article.author.id,
            email: article.author.email,
          },
          likesCount: likesCount.likesCount,
          isLiked: isLiked,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: articlesWithLikes,
      meta: {
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters: {
          search,
          country,
          city,
          tags,
          isPublished,
          sortBy,
          sortOrder,
        },
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['author', 'likes'],
    });
    if (!article) {
      this.errorService.throwNotFound('Article not found');
    }

    const likesCount = await this.likesService.getLikesCount(article.id);
    let isLiked = false;

    if (userId) {
      const likeStatus = await this.likesService.isLikedByUser(
        article.id,
        userId,
      );
      isLiked = likeStatus.isLiked;
    }

    return {
      ...article,
      likesCount: likesCount.likesCount,
      isLiked,
    };
  }

  async update(id: number, dto: UpdateArticleDto, userId: number) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      this.errorService.throwNotFound('Article not found');
    }
    if (article.author.id !== userId) {
      this.errorService.throwForbidden('You are not the author');
    }
    Object.assign(article, dto);
    return this.articleRepo.save(article);
  }

  async remove(id: number, userId: number) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      this.errorService.throwNotFound('Article not found');
    }
    if (article.author.id !== userId) {
      this.errorService.throwForbidden('You are not the author');
    }
    return this.articleRepo.remove(article);
  }
}
