import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SnowflakeDto {
  @IsString()
  @IsNotEmpty()
  @Length(18)
  id: string;
}