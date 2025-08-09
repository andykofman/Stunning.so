import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @MinLength(70)
  @MaxLength(300)
  idea!: string;
}


