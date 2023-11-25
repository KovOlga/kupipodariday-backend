import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RequestWithUser } from 'src/utils/types';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.wishlistsService.remove(req.user.id, +id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(req.user.id, +id, updateWishlistDto);
  }
}
