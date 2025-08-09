import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Idea, IdeaDocument } from './schemas/idea.schema';
import { Section } from './schemas/section.schema';

@Injectable()
export class IdeasService {
  constructor(
    @InjectModel(Idea.name)
    private readonly ideaModel: Model<IdeaDocument>,
  ) {}

  async create(data: Pick<Idea, 'idea' | 'sections'>): Promise<IdeaDocument> {
    const created = new this.ideaModel(data);
    return created.save();
  }

  async findAll(): Promise<IdeaDocument[]> {
    return this.ideaModel.find().exec();
  }

  async findById(id: string): Promise<IdeaDocument | null> {
    return this.ideaModel.findById(id).exec();
  }

  static buildDummySections(idea: string): Section[] {
    const hero: Section = {
      key: 'hero',
      title: `Your ${idea}`,
      body: 'one-line tagline',
      order: 0,
    };

    const about: Section = {
      key: 'about',
      title: 'About',
      body: `A short paragraph about ${idea}.`,
      order: 1,
    };

    const contact: Section = {
      key: 'contact',
      title: 'Contact',
      body: 'call-to-action line',
      order: 2,
    };

    return [hero, about, contact];
  }
}


