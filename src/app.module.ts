import { Module } from '@nestjs/common';
import { EndpointModule } from './api/endpoint/endpoint.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [EndpointModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
