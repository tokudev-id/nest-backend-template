import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Profile picture URL' })
  @IsOptional()
  @ValidateIf(
    (o) =>
      o.profilePictureUrl !== undefined &&
      o.profilePictureUrl !== null &&
      o.profilePictureUrl !== '',
  )
  @IsUrl()
  profilePictureUrl?: string;
}
