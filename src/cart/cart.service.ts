import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CartEntity } from './entities/cart.entity';
import { CustomError } from 'src/common/error/custom-error';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Cart Service');
    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDb connected');
    }

    async get(userId: string ) {
        try {
            const cart = await this.cart.findMany({ 
                where: { authorId: userId }
             })

            const productIds = cart.map(product => product.productId);

            const products = await this.product.findMany({
                where: {
                    id: { 
                        in: productIds
                    },
                },
                select: {
                    id: true,
                    price: true,
                    images: true,
                    title: true
                }
            })

            const productsObj = products.reduce((obj, product) => {
                obj[product.id] = {...product};
                return obj;
            }, {})

            const formattedCart = cart.map(item => ({
                ...item,
                productId: productsObj[item.productId]
            }));

            return formattedCart.map(CartEntity.fromObject);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async create(createCartDto: CreateCartDto) {
        const { productId, authorId } = createCartDto;

        const productCartExists = await this.cart.findFirst({ 
            where: { authorId, productId }
         });

        if (productCartExists)
            throw CustomError.badRequest('User has already created product cart');

        try {
            const productCart = await this.cart.create({
                data: createCartDto
            });

            const product = await this.product.findFirst({
                where: { id: productId },
                select: {
                    id: true,
                    price: true,
                    images: true,
                    title: true
                }
            });

            const cart = {
                ...productCart,
                productId: product
            }

            return CartEntity.fromObject(cart);

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateProduct(id: string, updateCartDto: UpdateCartDto) {
        const { id: _, ...rest } = updateCartDto;
        const productCartExists = await this.cart.findFirst({ 
            where: { id }
         });

        if (!productCartExists)
            throw CustomError.badRequest('Cart not found.');

        try {
            const updatedCart = await this.cart.update({
                where: {
                    id
                },
                data: rest
            });

            const { productId } = updatedCart;

            const product = await this.product.findFirst({
                where: { id: productId },
                select: {
                    id: true,
                    price: true,
                    images: true,
                    title: true
                }
            });

            const cart = {
                ...updatedCart,
                productId: product
            }
            return CartEntity.fromObject(cart);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteProduct(id: string) {
        const productCartExists = await this.cart.findFirst({ 
            where: { id }
         });

        if (!productCartExists)
            throw CustomError.badRequest('Cart not found.');

        try {
            return await this.cart.delete({
                where: { id }
            });
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

}
