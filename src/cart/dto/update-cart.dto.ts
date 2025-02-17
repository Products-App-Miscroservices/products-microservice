import { PartialType } from "@nestjs/mapped-types";
import { CreateCartDto } from "./create-cart.dto";
import { IsMongoId } from "class-validator";

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsMongoId()
    id: string;
}