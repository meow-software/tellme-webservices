import { IsString, IsNotEmpty, Length } from 'class-validator';
import { SnowflakeDto } from './snowflake-abstract.dto';

export class CheckLoginBotDto extends SnowflakeDto{

  @IsString()
  @IsNotEmpty()
  token: string;
}