import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [ProductsModule, ReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
