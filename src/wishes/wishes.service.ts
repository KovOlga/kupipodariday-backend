import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  getLast(): Promise<any> {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });
  }

  // async findOne(id: number): Promise<Wish> {
  //   return this.wishesRepository.findOneBy({ id });
  // }

  // update(id: number, updateWishDto: UpdateWishDto) {
  //   return this.wishesRepository.update({ id }, updateWishDto);
  // }

  // remove(id: number) {
  //   return this.wishesRepository.delete({ id });
  // }
}
