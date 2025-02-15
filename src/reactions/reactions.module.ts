import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  imports: [NatsModule]
})
export class ReactionsModule {}
