import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Injectable()
export class ReactionsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Reactions Service');
    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDb connected');
    }

    async getReviewReactions(reviewId: string, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const totalElements = await this.reaction.count({
            where: {
                available: true,
                reviewId: reviewId
            }
        });
        const totalPages = Math.ceil(totalElements / limit);

        return {
            data: await this.reaction.findMany({
                // skip es índice 0
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    available: true,
                    reviewId: reviewId
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
        const reaction = await this.reaction.findFirst({
            where: { 
                id
            }
        })

        if(!reaction) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: `Reaction with id ${id} not found`
            });
        }

        return reaction;
    }

    findByAuthorAndReview(authorId: string, reviewId: string) {
        return this.reaction.findFirst({
            where: { 
                authorId,
                reviewId
            }
        })
    }
    
    async create(createReactionDto: CreateReactionDto) {
        const { authorId, reviewId } = createReactionDto;
        const reaction = await this.findByAuthorAndReview(authorId, reviewId);
        
        if(reaction) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: `Reaction already exists.`
            });
        }

        return this.reaction.create({
            data: createReactionDto
        });
    }

    async update(id: string, updateReactionDto: UpdateReactionDto) {
        const { id: _, authorId: __, productId: ___, reviewId: ____, ...rest } = updateReactionDto;
        await this.findOne(id);
        return this.reaction.update({
            where: { id },
            data: rest
        })
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.reaction.update({
            where: { id },
            data: {
                available: false
            }
        })
    }

    async getUserReactions(authorId: string , productId: string ) {
        const reactions = await this.reaction.findMany({
            where: { 
                authorId,
                productId
            }
        })

        return {
            data: reactions
        }
    }
}
