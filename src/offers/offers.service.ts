import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<any> {
    const { amount, itemId, hidden } = createOfferDto;

    const wish = await this.wishesRepository.findOne({
      where: {
        id: itemId,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.raised = wish.raised + amount;

    try {
      await this.wishesRepository.save(wish);
      const newOffer = await this.offerRepository.save({
        amount,
        hidden,
        item: { id: itemId },
        user: { id: userId },
      });

      await queryRunner.commitTransaction();
      return newOffer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err.detail;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(offerId: number): Promise<Offer> {
    return this.offerRepository.findOne({
      where: {
        id: offerId,
      },
      relations: {
        user: {
          wishes: true,
          offers: true,
        },
        item: {
          owner: true,
          offers: true,
        },
      },
    });
  }
}
