import { IsNotEmpty } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  name: string;
  nbLots: number;
}
