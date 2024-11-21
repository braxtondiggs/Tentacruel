import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Price } from './price.entity';
import { PriceService } from './price.service';
import { PriceTaskService } from './price.task';
import { Portfolio } from '../portfolio/portfolio.entity';
import { PortfolioService } from '../portfolio/portfolio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Price, Portfolio])],
  providers: [PriceService, PriceTaskService, PortfolioService],
  exports: [PriceService]
})
export class PriceModule {}
