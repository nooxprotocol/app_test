import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EndpointController } from './endpoint.controller';
import { endpointProviders } from './endpoint.providers';
import { EndpointService } from './endpoint.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EndpointController],
  providers: [EndpointService, ...endpointProviders],
})
export class EndpointModule {}
