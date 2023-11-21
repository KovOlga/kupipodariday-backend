import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private userRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.userRepository.save(createWishlistDto);
  }

  async findAll(userId: number): Promise<Wishlist[]> {
    return this.userRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.userRepository.update({ id }, updateWishlistDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
