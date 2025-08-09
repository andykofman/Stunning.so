import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Section {
  @Prop()
  key?: 'hero' | 'about' | 'contact';

  @Prop()
  title?: string;

  @Prop()
  body?: string;

  @Prop()
  order?: number;
}

export const SectionSchema = SchemaFactory.createForClass(Section);


