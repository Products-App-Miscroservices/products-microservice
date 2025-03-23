import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNumber, IsString, Min, MinLength, ValidateNested } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(3)
    public title: string;

    @IsMongoId()
    public authorId: string;

    @IsNumber({
        maxDecimalPlaces: 4
    })
    @Min(0)
    @Type(() => Number)
    public price: number;

    @IsArray()
    @ArrayMinSize(1)
    @Type(() => String)
    public images: string[];

    @IsString()
    @MinLength(5)
    public description: string;

    @IsString()
    @MinLength(1)
    public slug: string;

}