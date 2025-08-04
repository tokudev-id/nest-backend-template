import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Likes')
@Controller('articles/:articleId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Like an article' })
  @ApiResponse({ status: 201, description: 'Article liked successfully' })
  @ApiResponse({ status: 409, description: 'Article already liked' })
  likeArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Request() req,
  ) {
    return this.likesService.likeArticle(articleId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Unlike an article' })
  @ApiResponse({ status: 200, description: 'Article unliked successfully' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  unlikeArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Request() req,
  ) {
    return this.likesService.unlikeArticle(articleId, req.user.userId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get likes count for an article' })
  @ApiResponse({ status: 200, description: 'Likes count retrieved' })
  getLikesCount(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.likesService.getLikesCount(articleId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('status')
  @ApiOperation({ summary: 'Check if current user liked the article' })
  @ApiResponse({ status: 200, description: 'Like status retrieved' })
  isLikedByUser(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Request() req,
  ) {
    return this.likesService.isLikedByUser(articleId, req.user.userId);
  }
}
