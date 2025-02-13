import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId } from "class-validator";
import { CreateProductDto } from "src/products/dto/create-product.dto";

export class UpdateReviewDto extends PartialType(CreateProductDto) {
    @IsMongoId()
    id: string
}