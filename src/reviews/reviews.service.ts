import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Reviews Service');
    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDB connected');
    }

    async getProductReviews(productId: string, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const totalElements = await this.review.count({
            where: {
                available: true,
                productId: productId
            }
        });
        const totalPages = Math.ceil(totalElements / limit);

        return {
            data: await this.review.findMany({
                // skip es índice 0
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    available: true,
                    productId: productId
                }
            }),
            meta: {
                total: totalElements,
                page: page,
                pages: totalPages
            }
        }

    }

    async findOne(id: string) {
        const review = await this.review.findFirst({
            where: { id }
        })

        if (!review) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: `Product with id ${id} not found`
            });
        }

        return review;
    }

    findByAuthorAndProduct(authorId: string, productId: string) {
        return this.review.findFirst({
            where: {
                authorId,
                productId
            }
        })
    }

    async create(createReviewDto: CreateReviewDto) {
        const { authorId, productId } = createReviewDto;
        const review = await this.findByAuthorAndProduct(authorId, productId)

        if (review) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Review already exists.'
            });
        }

        return this.review.create({
            data: createReviewDto
        });
    }

    async update(id: string, updateReviewDto: UpdateReviewDto) {
        const { id: __, authorId: ___, productId: ____, ...data } = updateReviewDto;
        await this.findOne(id);
        return this.review.update({
            where: { id },
            data: data
        })
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.review.update({
            where: { id },
            data: {
                available: false
            }
        });
    }
}
