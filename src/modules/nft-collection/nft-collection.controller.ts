import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NftCollectionService } from './nft-collection.service';
import { CreateNftCollectionDto } from './dto/create-nft-collection.dto';
import { UpdateNftCollectionDto } from './dto/update-nft-collection.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { Auth } from '../auth/decorator/auth.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@ApiTags('NFT Collection')
@Controller('nft-collections')
export class NftCollectionController {
  constructor(private readonly nftCollectionService: NftCollectionService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createNftCollectionDto: CreateNftCollectionDto) {
    return this.nftCollectionService.create(createNftCollectionDto);
  }

  @Get()
  findAll() {
    return this.nftCollectionService.findAll();
  }

  @Get('owned/:address')
  findByOwner(@Param('address') ownerAddress: string) {
    return this.nftCollectionService.findByOwner(ownerAddress);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNftCollectionDto: UpdateNftCollectionDto,
    @Auth() auth: JwtPayload,
  ) {
    return this.nftCollectionService.update(id, updateNftCollectionDto, auth);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Auth() auth: JwtPayload) {
    return this.nftCollectionService.remove(id, auth);
  }
}
