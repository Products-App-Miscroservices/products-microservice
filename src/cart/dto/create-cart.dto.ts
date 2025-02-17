import { IsMongoId, IsNumber, IsPositive } from "class-validator";

export class CreateCartDto {
    @IsMongoId()
    authorId: string;

    @IsMongoId()
    productId: string;

    @IsNumber()
    @IsPositive()
    quantity: number;
}