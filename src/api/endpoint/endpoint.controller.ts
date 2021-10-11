import { Controller, Get, Injectable, Post, Query } from '@nestjs/common';
import { logger } from 'src/logger/winston';
import { EndpointService } from './endpoint.service';

@Injectable()
@Controller('endpoint')
export class EndpointController {
  constructor(private readonly service: EndpointService) {}

  @Get('badge')
  async findBadge() {
    return await this.service.findBadgeDocs();
  }

  @Get('contract')
  async findContract() {
    return await this.service.findContractDocs();
  }

  @Get('contract_category')
  async findContractCategory() {
    return await this.service.findContractCategoryDocs();
  }

  @Get('raw_transaction')
  async findRawTransaction() {
    return await this.service.findRawTransactionDocs();
  }

  @Get('user_badge_progress')
  async findUserBadgeProgress() {
    return await this.service.findUserBadgeProgressDocs();
  }

  @Get('user_badge')
  async findUserBadge() {
    return await this.service.findUserBadgeDocs();
  }

  @Post('init_sample_db')
  async initSampleDB() {
    return await this.service.initSampleDB();
  }

  @Post('init_raw_tx')
  async initRawTxDB(@Query('dirPath') dirPath: string) {
    return await this.service.initRawTxDB(dirPath);
  }

  @Post('update_user_badge_progress')
  async updateUserBadgeProgress(@Query('id') id: string) {
    return await this.service.updateUserBadgeProgress(id);
  }

  @Post('update_user_badge')
  async updateUserBadge(@Query('id') id: string) {
    return await this.service.updateUserBadge(id);
  }

  @Get('get_badge')
  async getBadge(@Query('id') id: string) {
    return await this.service.getBadge(id);
  }
}
