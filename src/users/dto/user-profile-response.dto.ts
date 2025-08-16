import { ApiProperty } from '@nestjs/swagger';
import { ExternalProvider } from '../user.entity';

export class UserProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  username: string;

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
}
