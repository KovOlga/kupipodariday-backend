import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishListsRepository.find();
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<any> {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const newWishList = await this.wishListsRepository.create({
      ...rest,
      owner: {
        id: userId,
      },
      items,
    });
    console.log('newWishList', newWishList);
    return this.wishListsRepository.save(newWishList);
  }

  async findOne(wishListId: number): Promise<Wishlist> {
    const wishList = await this.wishListsRepository.findOne({
      where: { id: wishListId },
      relations: {
        items: true,
        owner: true,
      },
    });
    return wishList;
  }

  remove(id: number) {
    return this.wishListsRepository.delete({ id });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));

    await this.wishListsRepository.save({
      id: id,
      ...rest,
      items,
    });

    const updatedWish = this.wishListsRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        items: true,
      },
    });

    return updatedWish;
  }
}
