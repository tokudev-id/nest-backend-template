import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BaseResponseDto,
  PaginatedResponseDto,
} from '../dto/base-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ArticleResponseDto } from 'src/articles/dto/article-response.dto';
import { CommentResponseDto } from 'src/comments/dto/comment-response.dto';
import { LikeResponseDto } from 'src/likes/dto/like-response.dto';
import { Comment } from 'src/comments/comment.entity';
import { Article } from 'src/articles/article.entity';
import { User } from 'src/users/user.entity';
import { Like } from 'src/likes/like.entity';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If data is already a response DTO, return as is
        if (data && (data.success !== undefined || data.data !== undefined)) {
          return data;
        }

        // Transform based on the endpoint
        const request = context.switchToHttp().getRequest();
        const url = request.url;

        if (url.includes('/auth/login')) {
          return new BaseResponseDto(
            { access_token: data.access_token },
            'Login successful',
          );
        }

        if (
          url.includes('/articles') &&
          !url.includes('/comments') &&
          !url.includes('/likes')
        ) {
          if (Array.isArray(data)) {
            // Handle simple array
            const transformedData = data.map((article: any) =>
              this.transformArticle({ ...article }),
            );
            return new BaseResponseDto(
              transformedData,
              'Articles retrieved successfully',
            );
          } else if (
            data &&
            typeof data === 'object' &&
            'data' in data &&
            'meta' in data
          ) {
            // Handle paginated articles
            const transformedData = data.data.map((article: any) =>
              this.transformArticle(article),
            );
            return new PaginatedResponseDto(
              transformedData,
              data.meta.pagination,
              'Articles retrieved successfully',
            );
          } else {
            // Handle single article
            return new BaseResponseDto(
              this.transformArticle(data),
              'Article retrieved successfully',
            );
          }
        }

        if (url.includes('/comments')) {
          if (Array.isArray(data)) {
            // Handle simple array
            const transformedData = data.map((comment: any) =>
              this.transformComment(comment),
            );
            return new BaseResponseDto(
              transformedData,
              'Comments retrieved successfully',
            );
          } else if (
            data &&
            typeof data === 'object' &&
            'data' in data &&
            'meta' in data
          ) {
            // Handle paginated comments
            const transformedData = data.data.map((comment: any) =>
              this.transformComment(comment),
            );
            return new PaginatedResponseDto(
              transformedData,
              data.meta.pagination,
              'Comments retrieved successfully',
            );
          } else {
            // Handle single comment
            return new BaseResponseDto(
              this.transformComment(data),
              'Comment retrieved successfully',
            );
          }
        }

        if (url.includes('/likes')) {
          if (data.likesCount !== undefined) {
            return new BaseResponseDto(
              { likesCount: data.likesCount },
              'Likes count retrieved',
            );
          }
          if (data.isLiked !== undefined) {
            return new BaseResponseDto(
              { isLiked: data.isLiked },
              'Like status retrieved',
            );
          }
          if (data.message) {
            return new BaseResponseDto(null, data.message);
          }
          return new BaseResponseDto(
            this.transformLike(data),
            'Like action successful',
          );
        }

        // Default response
        return new BaseResponseDto(data, 'Success');
      }),
    );
  }

  private transformUser(user: User): UserResponseDto | null {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private transformArticle(
    article: { likesCount: number; isLiked: boolean } & Article,
  ): ArticleResponseDto | null {
    if (!article) return null;
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      likesCount: article.likesCount,
      isLiked: article.isLiked,
      author: this.transformUser(article.author),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  private transformComment(comment: Comment): CommentResponseDto | null {
    if (!comment) return null;
    return {
      id: comment.id,
      content: comment.content,
      author: this.transformUser(comment.author),
      article: this.transformArticle({
        ...comment.article,
        likesCount: 0,
        isLiked: false,
      }),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  private transformLike(like: Like): LikeResponseDto | null {
    if (!like) return null;
    return {
      id: like.id,
      user: this.transformUser(like.user),
      article: this.transformArticle({
        ...like.article,
        likesCount: 0,
        isLiked: false,
      }),
      createdAt: like.createdAt,
      updatedAt: like.updatedAt,
    };
  }
}
