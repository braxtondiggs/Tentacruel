import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Binance from 'binance-api-node';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { UpdateUserDto } from './dto';
import User from './users.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>
  ) {}

  async create(id: string) {
    return (await this.user.insert({ id })).generatedMaps[0] as User;
  }

  async update(dto: UpdateUserDto, user: User) {
    const data = this.user.create({ ...user, ...dto });
    return await this.user.update(user.id, data);
  }

  async getById(id: string) {
    return await this.user.findOneBy({ id });
  }

  async getBinanceInfo(user: User) {
    user = instanceToPlain(new User(user)) as User;
    const binance = Binance({
      apiKey: user.binanceAPIKey,
      apiSecret: user.binanceSecretKey
    });
    return await binance.accountInfo();
  }
}
