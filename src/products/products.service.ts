import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import { ProductEntity } from './entities/product.entity';
import { CustomError } from 'src/common/error/custom-error';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('Products Service')

    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDb connected');
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const totalElements = await this.product.count({ where: { available: true } });
        const totalPages = Math.ceil(totalElements / limit);
        const products = await this.product.findMany({
            // skip es índice 0
            skip: (page - 1) * limit,
            take: limit,
            where: {
                available: true
            },
            include: {
                reviews: {
                    select: {
                        rating: true
                    },
                }
            }
        });

        const transformedProducts = products.map(product => ({
            ...product,
            rating: product.reviews.length
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0,
            totalReviews: product.reviews.length
        }))

        return {
            data: transformedProducts.map(ProductEntity.fromObject),
            meta: {
                total: totalElements,
                page: page,
                pages: totalPages
            }
        }

    }

    async findById(id: string) {
        const product = await this.product.findFirst({
            where: {
                id
            },
            include: {
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        });

        if (!product) {
            throw CustomError.badRequest(`Product with id ${id} not found`);
        }

        const transformedProduct = {
            ...product,
            rating: product.reviews.length
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0,
            totalReviews: product.reviews.length
        }

        return {
            data: ProductEntity.fromObject(transformedProduct)
        }
    }

    async findBySlug(slug: string) {
        const product = await this.product.findFirst({
            where: {
                slug
            },
            include: {
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        });

        if (!product) {
            throw CustomError.badRequest(`Product with id ${slug} not found`);
        }

        const transformedProduct = {
            ...product,
            rating: product.reviews.length
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0,
            totalReviews: product.reviews.length
        }

        return {
            data: ProductEntity.fromObject(transformedProduct)
        }
    }

    async create(createProductDto: CreateProductDto) {
        return this.product.create({
            data: createProductDto
        })
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const { id: __, ...data } = updateProductDto;
        try {
            return this.product.update({
                where: { id },
                data: data
            })
        } catch (error) {
            throw new RpcException(error);
        }

    }

    async delete(id: string) {
        return this.product.update({
            where: { id },
            data: {
                available: false
            }
        });
    }

    async validateProducts(ids: string[]) {
        ids = Array.from(new Set(ids));

        const products = await this.product.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        if (products.length !== ids.length) {
            throw new RpcException({
                message: 'Some products were not found',
                status: HttpStatus.BAD_REQUEST
            })
        }

        return products;
    }

}
