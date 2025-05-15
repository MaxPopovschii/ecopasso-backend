import { IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  userId: number;
}