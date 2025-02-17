import { CustomError } from "src/common/error/custom-error";

export class ProductEntity {
    constructor(
        public id: string,
        public title: string,
        public price: number,
        public authorId: string,
        public images: string[],
        public description: string,
        public rating?: number,
        public totalReviews?: number,
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { id, title, price, authorId, images, description, rating, totalReviews } = object;

        if (!id) throw CustomError.badRequest('Product Mapper. Missing id');
        if (!title) throw CustomError.badRequest('Product Mapper. Missing title');
        if (!price) throw CustomError.badRequest('Product Mapper. Missing price');
        if (!images) throw CustomError.badRequest('Product Mapper. Missing images');
        if (!description) throw CustomError.badRequest('Product Mapper. Missing description');
        if (!authorId) throw CustomError.badRequest('Product Mapper. Missing Author Id');
        if (!rating && isNaN(rating)) throw CustomError.badRequest('Product Mapper. Rating must be a number');
        if (!totalReviews && isNaN(totalReviews)) throw CustomError.badRequest('Product Mapper. Total Reviews must be a number');

        return new ProductEntity(id, title, price, authorId, images, description, rating, totalReviews);
    }
}