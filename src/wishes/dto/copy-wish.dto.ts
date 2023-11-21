import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CopyWishDto {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  raised: number;

  copied: number;

  @Length(1, 1024)
  description: string;
}
