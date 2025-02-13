import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [NatsModule]
})
export class ReviewsModule { }
