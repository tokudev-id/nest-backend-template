import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ArticleResponseDto } from 'src/articles/dto/article-response.dto';

export class CommentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false })
  author: UserResponseDto | null;

  @ApiProperty({ required: false })
  article: ArticleResponseDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
