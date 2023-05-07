import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({ summary: 'get all users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async index(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.service.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get profile by ID' })
  @ApiResponse({
    status: 200,
  })
  @ApiParam({ name: 'id' })
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
