import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Coin } from './coin.entity';
import { CoinService } from './coin.service';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import FindOneParams from '../utils/findOneParams';

@ApiTags('Coin')
@ApiBearerAuth('token')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
@Controller('coin')
export class CoinController {
  constructor(private readonly coin: CoinService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get all coins', description: 'This endpoint is used to get all coins.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The coins records', type: Coin, isArray: true })
  async getCoins(): Promise<Coin[]> {
    return this.coin.getCoins();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({ name: 'id', required: true, description: 'The id of the coin', type: String })
  @ApiOperation({ summary: 'Get coin by id', description: 'This endpoint is used to get a coin by id.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The coin record', type: Coin, isArray: false })
  getCoinById(@Param() { id }: FindOneParams): Promise<Coin> {
    return this.coin.getCoinById(id);
  }
}
