import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CoinGeckoClient } from 'coingecko-api-v3';

import { CreatePortfolioDto, UpdatePortfolioDto } from './dto';
import { Portfolio } from './portfolio.entity';
import User from '../users/users.entity';

@Injectable()
export class PortfolioService {
  private readonly gecko = new CoinGeckoClient({ timeout: 10000, autoRetry: true });
  constructor(@InjectRepository(Portfolio) private readonly portfolio: EntityRepository<Portfolio>) {}

  async createPortfolioItem(dto: CreatePortfolioDto, user: User): Promise<Portfolio> {
    //const coin = await this.gecko.coinId({ id: dto.coin, localization: false, developer_data: false });
    const portfolio = this.portfolio.create(new Portfolio({ ...dto, user }));
    await this.portfolio.persistAndFlush(portfolio);
    return portfolio;
  }

  async getPortfolioByUser(user: User): Promise<Portfolio[]> {
    return await this.portfolio.find(
      { user },
      {
        populate: ['coin']
      }
    );
  }

  async getPortfolio(): Promise<Portfolio[]> {
    return await this.portfolio.findAll({
      populate: ['coin']
    });
  }

  async getPortfolioById(id: string, user: User): Promise<Portfolio> {
    return await this.portfolio.findOne({ id, user }, { populate: ['coin'] });
  }

  async updatePortfolioItem(id: string, item: UpdatePortfolioDto, user: User): Promise<Portfolio> {
    const existingItem = await this.getPortfolioById(id, user);
    wrap(existingItem).assign(item);
    await this.portfolio.persistAndFlush(existingItem);
    return existingItem;
  }

  async deletePortfolioItem(id: string, user: User): Promise<void> {
    const post = await this.getPortfolioById(id, user);
    return await this.portfolio.removeAndFlush(post);
  }
}
