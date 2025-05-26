import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'mario.rossi@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'PasswordSicura123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Mario' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Rossi' })
  @IsString()
  surname: string;
}