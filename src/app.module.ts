import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [ProductsModule, ReviewsModule, ReactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
