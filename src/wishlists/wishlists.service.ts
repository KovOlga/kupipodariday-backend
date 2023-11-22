import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishListsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const newWishList = await this.wishListsRepository.create({
      ...rest,
      owner: {
        id: userId,
      },
      items,
    });
    const { id } = await this.wishListsRepository.save(newWishList);
    return this.wishListsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
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

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
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
