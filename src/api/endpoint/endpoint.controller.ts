import { Controller, Get, Injectable, Param, Post } from '@nestjs/common';
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

  @Post('init_db')
  async initDB() {
    return await this.service.initDB();
  }

  @Post('update_user_badge_progress')
  async updateUserBadgeProgress(@Param('id') id: string) {
    return await this.service.updateUserBadgeProgress(id);
  }

  @Post('update_user_badge')
  async updateUserBadge(@Param('id') id: string) {
    return await this.service.updateUserBadge(id);
  }
}
