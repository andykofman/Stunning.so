import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { Idea } from './schemas/idea.schema';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Get()
  findAll() {
    return this.ideasService.findAll();
  }

  @Get(':id')
  findById(@Param('id', MongoIdPipe) id: string) {
    return this.ideasService.findById(id);
  }

  @Post()
  create(@Body() body: CreateIdeaDto) {
    return this.ideasService.create({ idea: body.idea, sections: [] });
  }
}


