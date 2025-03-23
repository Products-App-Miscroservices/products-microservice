import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UpdateReviewDto } from './dto/update-review.dto';
import { NATS_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';
import { CustomError } from 'src/common/error/custom-error';

@Injectable()
export class ReviewsService extends PrismaClient implements OnModuleInit {

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {
        super()
    }

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

        const reviews = await this.review.findMany({
            // skip es índice 0
            skip: (page - 1) * limit,
            take: limit,
            where: {
                available: true,
                productId: productId
            },
            include: {
                reactions: {
                    select: {
                        reaction: true
                    }
                }
            }
        });

        const userIds = reviews.map(review => review.authorId);

        const usersData = await firstValueFrom(this.client.send('auth.get.users', { ids: userIds }));

        const usersObj = usersData.data.reduce((obj, user) => {
            obj[user.id] = { username: user.username, id: user.id }
            return obj
        }, {})

        const transformedReviews = reviews.map(review => ({
            ...review,
            author: usersObj[review.authorId],
            reactions: review.reactions.reduce((sum, obj) => {
                const { reaction } = obj;

                if (!(reaction in sum)) {
                    sum[reaction] = 0
                }

                sum[reaction] += 1

                return sum
            }, {})
        }))

        return {
            data: transformedReviews,
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

    async softDelete(id: string) {
        await this.findOne(id);
        
        return this.review.update({
            where: { id },
            data: {
                available: false
            }
        });
    }

    async hardDelete(id: string) {
        await this.findOne(id);
        await this.reaction.deleteMany({
            where: {
                reviewId: id
            }
        })
        return this.review.delete({
            where: { id }
        });
    }

    async findByProductId(productId: string, authorId: string) { 

        const review = await this.review.findFirst({
            where: { 
                productId,
                authorId
            }
        }); 

        if(!review) {
            throw CustomError.badRequest(`Review with id ${productId} not found`);
        }

        return {
            data: review
        }
    }
}
