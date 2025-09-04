import { IsString, IsNotEmpty } from 'class-validator';
import { SnowflakeDto } from '../index';

export class CheckLoginBotDto extends SnowflakeDto{
  @IsString()
  @IsNotEmpty()
  token: string;
}