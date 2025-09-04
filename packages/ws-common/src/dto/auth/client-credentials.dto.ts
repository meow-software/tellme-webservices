import { IsString, Length } from 'class-validator';
import { SnowflakeDto } from '../index';

export class ClientCredentialsDto extends SnowflakeDto{
  @IsString() 
  @Length(70) 
  clientSecret: string;
}
