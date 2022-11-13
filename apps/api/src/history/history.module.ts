import { Module } from '@nestjs/common';
import { UtilService } from '../util.service';
import { HistoryController } from './history.controller';

@Module({
  controllers: [HistoryController],
  providers: [UtilService]
})
export class HistoryModule { }
