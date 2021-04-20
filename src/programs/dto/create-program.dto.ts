import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProgramDto {
  @IsNotEmpty()
  name: string;
  @IsNumber()
  nbLots: number;
}
