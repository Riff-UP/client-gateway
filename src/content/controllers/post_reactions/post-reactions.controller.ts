import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CONTENT_SERVICE } from "src/config/services";
import { CreatePostReactionsDto } from "src/content/dto";

@Controller('posts/reactions')
export class PostReactionsController {
    constructor(
        @Inject(CONTENT_SERVICE) private readonly postReactionsService : ClientProxy
    ){}

    @Post()
    create(@Body() createPostReactionsDto : CreatePostReactionsDto){
        return this.postReactionsService.send('createPostReaction', createPostReactionsDto || {});
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.postReactionsService.send('removePostReaction', id);
    }

}