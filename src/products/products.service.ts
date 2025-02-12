import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';

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

        return {
            data: await this.product.findMany({
                // skip es índice 0
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    available: true
                }
            }),
            meta: {
                total: totalElements,
                page: page,
                pages: totalPages
            }
        }

    }

    async create(createProductDto: CreateProductDto) {
        return this.product.create({
            data: createProductDto
        })
    }

}
