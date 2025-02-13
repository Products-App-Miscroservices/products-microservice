import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsPositive, IsString, Max, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsMongoId()
    authorId: string;

    @IsMongoId()
    productId: string;

    @IsNumber()
    @IsPositive()
    @Max(5)
    @Type(() => Number)
    rating: number;

    @IsString()
    @MinLength(4)
    comment: string;
}