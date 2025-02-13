import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Reviews Service');
    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDB connected');
    }

    async getProductReviews(id: string, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const totalElements = await this.review.count({
            where: {
                available: true,
                productId: id
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
                    productId: id
                }
            }),
            meta: {
                total: totalElements,
                page: page,
                pages: totalPages
            }
        }

    }

    async findOne() {

    }

    create(createReviewDto: CreateReviewDto) {
        return this.review.create({
            data: createReviewDto
        });
    }
}
