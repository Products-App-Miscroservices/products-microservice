import { ReactionOptions } from "@prisma/client";
import { IsEnum, IsMongoId, IsString } from "class-validator";
import { ReactionsList } from "../enum/reaction.enum";

export class CreateReactionDto {
    @IsMongoId()
    authorId: string;

    @IsMongoId()
    reviewId: string;

    @IsMongoId()
    productId: string;

    @IsString()
    @IsEnum(ReactionsList, {
        message: `Valid reactions are ${ReactionsList}`
    })
    reaction: ReactionOptions;
}