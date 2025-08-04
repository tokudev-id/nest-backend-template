import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './article.entity';
import { User } from 'src/users/user.entity';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), LikesModule],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
