import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @MessagePattern('products.get')
  findAll(
    @Payload() paginationDto: PaginationDto
  ) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('products.get.product')
  findOne(
    @Payload('id') id: string
  ) {
    return this.productsService.findById(id);
  }

  @MessagePattern('products.get.product.slug')
  findBySlug(
    @Payload('slug') slug: string
  ) {
    return this.productsService.findBySlug(slug);
  }

  @MessagePattern('products.create')
  create(
    @Payload() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('products.update')
  update(
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern('products.delete')
  delete(
    @Payload('id') id: string
  ) {
    return this.productsService.delete(id);
  }

  @MessagePattern('products.validate')
  validateProducts(@Payload() ids: string[]) {
    return this.productsService.validateProducts(ids);
  }
}
