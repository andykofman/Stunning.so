import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Section, SectionSchema } from './section.schema';

export type IdeaDocument = HydratedDocument<Idea>;

@Schema({ timestamps: true })
export class Idea {
  @Prop({ required: true, minlength: 70, maxlength: 300 })
  idea!: string;

  @Prop({ type: [SectionSchema], default: [] })
  sections!: Section[];
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);


