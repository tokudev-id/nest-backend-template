import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './comment.entity';
import { Article } from 'src/articles/article.entity';
import { User } from 'src/users/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ErrorService } from 'src/common/services/error.service';
import { GetPaginatedCommentsDto } from './dto/get-pagination-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private errorService: ErrorService,
  ) {}

  async create(articleId: number, dto: CreateCommentDto, userId: number) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId },
    });
    if (!article) {
      this.errorService.throwNotFound('Article not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.errorService.throwUnauthorized('User not found');
    }

    const comment = this.commentRepo.create({
      content: dto.content,
      article,
      author: user,
    });
    return this.commentRepo.save(comment);
  }

  async findByArticle(
    articleId: number,
    paginationDto: GetPaginatedCommentsDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepo.findAndCount({
      where: { article: { id: articleId } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['author'],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: comments,
      meta: {
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  }

  async update(id: number, dto: UpdateCommentDto, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      this.errorService.throwNotFound('Comment not found');
    }
    if (comment.author.id !== userId) {
      this.errorService.throwForbidden('Not your comment');
    }

    Object.assign(comment, dto);
    return this.commentRepo.save(comment);
  }

  async remove(id: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) {
      this.errorService.throwNotFound('Comment not found');
    }
    if (comment.author.id !== userId) {
      this.errorService.throwForbidden('Not your comment');
    }

    return this.commentRepo.remove(comment);
  }
}
