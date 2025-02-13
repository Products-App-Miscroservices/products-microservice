import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import { IsMongoId } from "class-validator";

// El Dto para el gateway no lleva el id.
export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsMongoId()
    id: string;
}