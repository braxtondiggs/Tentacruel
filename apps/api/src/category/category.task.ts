import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosError } from 'axios';
import { firstValueFrom, retry, timeout } from 'rxjs';

import { CategoryService } from '../category/category.service';

@Injectable()
export class CategoryTask {
  private readonly logger = new Logger(CategoryTask.name);

  constructor(private readonly category: CategoryService, private readonly http: HttpService) {}

  private async fetchCategories() {
    return firstValueFrom(
      this.http
        .get('https://api.coingecko.com/api/v3/coins/categories/list', {
          timeout: 10000
        })
        .pipe(timeout(12000), retry({ count: 3, delay: 1000 }))
    );
  }

  @Cron(CronExpression.EVERY_WEEK)
  async syncCategories() {
    try {
      this.logger.log('Starting Category Sync');

      const [apiResponse, existingCategories] = await Promise.all([
        this.fetchCategories(),
        this.category.getCategories()
      ]);

      if (!apiResponse?.data || !Array.isArray(apiResponse.data)) {
        throw new Error('Invalid API response format');
      }

      const apiCategories = apiResponse.data;

      const newCategories = apiCategories
        .map((c) => ({ slug: c.category_id, name: c.name }))
        .filter((category) => !existingCategories.find((existing) => existing.slug === category.slug));

      const missingCategories = existingCategories
        .filter((existing) => !apiCategories.find((api) => api.category_id === existing.slug))
        .map((category) => category.id);

      if (newCategories.length > 0) {
        await this.category.createMany(newCategories);
        this.logger.log(
          `Added ${newCategories.length} categories: ${newCategories.map(({ name }) => name).join(', ')}`
        );
      }

      if (missingCategories.length > 0) {
        await this.category.removeMany(missingCategories);
        this.logger.log(`Removed ${missingCategories.length} obsolete categories`);
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        this.logger.error(`Category sync failed: ${e.message}`, {
          status: e.response?.status,
          statusText: e.response?.statusText,
          data: e.response?.data
        });
      } else {
        this.logger.error(`Category sync failed: ${e.message}`);
      }
      throw e;
    } finally {
      this.logger.log('Category Sync Complete');
    }
  }
}
