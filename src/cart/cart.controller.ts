import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('cart.get.products')
  getUserCart(
    @Payload('userId') userId: string
  ) {
    return this.cartService.get(userId);
  }

  @MessagePattern('cart.create')
  createCart(
    @Payload() createCartDto: CreateCartDto
  ) {
    return this.cartService.create(createCartDto);
  }

  @MessagePattern('cart.update')
  updateCart(
    @Payload() updateCartDto: UpdateCartDto
  ) {
    return this.cartService.updateProduct(updateCartDto.id, updateCartDto);
  }

  @MessagePattern('cart.delete')
  deleteCart(
    @Payload('id') id: string
  ) {
    return this.cartService.deleteProduct(id);
  }
}
