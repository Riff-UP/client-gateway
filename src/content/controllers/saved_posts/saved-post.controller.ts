import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CONTENT_SERVICE } from "src/config/services";
import { CreateSavedPostDto } from "../../dto";


@Controller('posts/saved')
export class SavedPostsController {
    constructor(
        @Inject(CONTENT_SERVICE) private readonly savedPostsService : ClientProxy
    ){}

    @Post()
    create(@Body() createSavedPostDto: CreateSavedPostDto){
        return this.savedPostsService.send('createSavedPost', createSavedPostDto || {})
    }

    @Get()
    findAll(){
        return this.savedPostsService.send('findAllSavedPosts', {})
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.savedPostsService.send('removeSavedPost', id)
    }
}