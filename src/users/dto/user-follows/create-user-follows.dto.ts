import { IsString } from "class-validator";

export class CreateUFDto {

    @IsString()    
    followerId!: string

    @IsString()
    followedId!: string
}