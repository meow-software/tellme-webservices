import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
    @IsOptional()
    @IsBoolean()
    full: boolean = false;
}