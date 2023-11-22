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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RequestWithUser } from 'src/utils/types';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestWithUser) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findOne(+id);
  }

  @Delete(':id')
  deleteOneWish(@Param('id') id: string) {
    this.wishesService.remove(+id);
  }

  @Patch(':id')
  updateWish(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.wishesService.copy(req.user.id, +id);
  }
}
