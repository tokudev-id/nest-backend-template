import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CommonModule } from '../common/common.module';
import { Comment } from 'src/comments/comment.entity';
import { Like } from 'src/likes/like.entity';
import { Article } from 'src/articles/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Comment, Like, Article]),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
