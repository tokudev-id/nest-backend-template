import { ApiProperty } from '@nestjs/swagger';
import { ExternalProvider } from '../user.entity';

export class UserProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  profilePictureUrl?: string;

  @ApiProperty({ required: false })
  externalAccountId?: string;

  @ApiProperty({ enum: ExternalProvider, required: false })
  externalProvider?: ExternalProvider;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Total number of comments made by the user' })
  totalComments: number;

  @ApiProperty({ description: 'Total number of articles liked by the user' })
  totalLikes: number;

  @ApiProperty({
    description: 'Total number of articles published by the user',
  })
  totalArticlesPublished: number;
}
