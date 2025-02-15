import { PartialType } from "@nestjs/mapped-types";
import { CreateReactionDto } from "./create-reaction.dto";
import { IsMongoId } from "class-validator";

export class UpdateReactionDto extends PartialType(CreateReactionDto) {
    @IsMongoId()
    id: string
}