import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BasePaginationRequestDto } from 'src/common/dto/base-pagination-request.dto';

@ApiTags('Comments')
@Controller('articles/:articleId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(
      articleId,
      dto,
      req.user.userId as number,
    );
  }

  @Get()
  findAll(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Query() paginationDto: BasePaginationRequestDto,
  ) {
    return this.commentsService.findByArticle(articleId, paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:commentId')
  update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.update(
      commentId,
      dto,
      req.user.userId as number,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/:commentId')
  remove(@Param('commentId', ParseIntPipe) commentId: number, @Request() req) {
    return this.commentsService.remove(commentId, req.user.userId);
  }
}
