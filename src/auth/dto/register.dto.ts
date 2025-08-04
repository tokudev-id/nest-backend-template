import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

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
