import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ArticleResponseDto } from 'src/articles/dto/article-response.dto';

export class LikeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  user?: UserResponseDto | null;

  @ApiProperty({ required: false })
  article?: ArticleResponseDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
