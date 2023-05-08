import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNftCollectionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tokenAddress: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;
}
