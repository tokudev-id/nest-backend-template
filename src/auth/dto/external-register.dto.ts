import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ExternalProvider } from '../../users/user.entity';

export class ExternalRegisterDto {
  @ApiProperty({
    enum: ExternalProvider,
    description:
      'External provider type (e.g., toku, google, facebook, github)',
  })
  @IsEnum(ExternalProvider)
  provider: ExternalProvider;

  @ApiProperty({
    description: 'Access token from external provider to get user info',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
