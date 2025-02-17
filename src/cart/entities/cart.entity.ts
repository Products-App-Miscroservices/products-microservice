import { CustomError } from "src/common/error/custom-error";

export class CartEntity {
    constructor(
        public id: string,
        public userId: string,
        public productId: string,
        public quantity: number,
        public price: number,
        public image: string,
        public name: string,
    ) { }

    static fromObject(object: { [key: string]: any }) {
        const { id, authorId, productId: product, quantity } = object;
        const { price, title, images, id: productId } = product;

        if (!id) throw CustomError.badRequest('Cart Mapper. Missing id');
        if (!authorId) throw CustomError.badRequest('Cart Mapper. Missing user id');
        if (!product) throw CustomError.badRequest('Cart Mapper. Missing product');
        if (!quantity) throw CustomError.badRequest('Cart Mapper. Missing quantity');
        if (!title) throw CustomError.badRequest('Cart Mapper. Missing title');
        if (!Array.isArray(images)) throw CustomError.badRequest('Cart Mapper. Missing image');
        if (!price) throw CustomError.badRequest('Cart Mapper. Missing price');

        return new CartEntity(id, authorId, productId, +quantity, +price, images[0], title);
    }
}