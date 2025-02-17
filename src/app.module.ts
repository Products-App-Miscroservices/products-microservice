import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ProductsModule, ReviewsModule, ReactionsModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
