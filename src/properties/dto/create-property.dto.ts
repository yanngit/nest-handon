import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  name: string;
  @IsNumber()
  nbLots: number;
}
