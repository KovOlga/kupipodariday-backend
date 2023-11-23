import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find({
      relations: {
        owner: true,
      },
    });
  }

  getLastWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  getTopWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  async findOne(wishId: number): Promise<Wish> {
    return this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  remove(id: number) {
    return this.wishesRepository.delete({ id });
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishesRepository.update({ id }, updateWishDto);
    return this.wishesRepository.findOneBy({ id });
  }

  async copy(userId: any, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.copied++;

    const { name, link, image, price, description } = wish;

    const myNewWish = {
      name,
      link,
      image,
      price,
      description,
      owner: { id: userId },
    };

    try {
      await this.wishesRepository.save(wish);
      await this.wishesRepository.create(myNewWish);
      await this.wishesRepository.save(myNewWish);

      await queryRunner.commitTransaction();
      return myNewWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err.detail;
    } finally {
      await queryRunner.release();
    }
  }
}
