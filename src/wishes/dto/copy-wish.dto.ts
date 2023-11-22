import {
  IsString,
  Length,
  IsUrl,
  IsNumber,
  Min,
  IsDateString,
  IsInt,
} from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CopyWishDto {
  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;

  // @Length(1, 250)
  // @IsString()
  // name: string;

  // @IsUrl()
  // link: string;

  // @IsUrl()
  // image: string;

  // @IsNumber()
  // @Min(1)
  // price: number;

  // raised: number;

  // copied: number;

  // @Length(1, 1024)
  // description: string;

  @IsInt()
  id: number;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @Min(1)
  price: number;

  @Min(1)
  raised: number;

  copied: number;

  @Length(1, 1024)
  description: string;
}
