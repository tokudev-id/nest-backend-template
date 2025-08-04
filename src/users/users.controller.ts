import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

@Controller('user-profile')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserProfile(
    @Request() req: RequestWithUser,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getUserProfile(req.user?.userId);
  }

  @Put()
  async updateUserProfile(
    @Request() req: RequestWithUser,
    @Body() updateDto: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateUserProfile(req.user?.userId, updateDto);
  }
}
