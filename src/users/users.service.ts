import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(userId, updateUserDto);

    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async findUserWishes(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        wishes: {
          owner: true,
        },
      },
    });

    return user.wishes;
  }

  async findMany(query: any): Promise<User[] | undefined> {
    const user = await this.usersRepository.find({
      where: [
        {
          username: query,
        },
        { email: query },
      ],
    });

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    return user;
  }

  // remove(id: number) {
  //   return this.usersRepository.delete({ id });
  // }
}
