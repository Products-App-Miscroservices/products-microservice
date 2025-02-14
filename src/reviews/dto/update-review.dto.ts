import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId } from "class-validator";
import { CreateReviewDto } from "./create-review.dto";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @IsMongoId()
    id: string
}