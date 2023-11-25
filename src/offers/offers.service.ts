import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
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
      relations: {
        owner: true,
      },
    });

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя скинуться на свой подарок');
    }

    const { price, raised } = wish;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    wish.raised = wish.raised + amount;

    if (wish.raised > wish.price) {
      throw new ForbiddenException(
        `Для покупки подарка необходимо всего лишь ${price - raised}р.`,
      );
    } else {
    }

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

  async findOne(offerId: number): Promise<Offer | object> {
    const offer = await this.offerRepository.findOne({
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

    if (offer.hidden) {
      return new Object();
    }

    console.log('sxs', offer.hidden);

    return offer;
  }
}
