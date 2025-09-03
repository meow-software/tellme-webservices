import { IsString, IsNotEmpty } from 'class-validator';

export class CheckLoginDto {
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}