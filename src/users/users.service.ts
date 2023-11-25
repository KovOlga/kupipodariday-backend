import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAlreadyExistsException } from 'src/exceptions/user-exists.exception';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...rest } = createUserDto;
      const hash = await this.hashService.hash(password);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hash,
      });
      await this.usersRepository.insert(user);
      return user;
    } catch (err) {
      throw new UserAlreadyExistsException();
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;
    const hash = await this.hashService.hash(password);

    await this.usersRepository.update(userId, {
      ...updateUserDto,
      password: hash,
    });
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async findUserWishes(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        wishes: {
          owner: {
            username: username,
          },
        },
      },
      select: {
        wishes: {
          owner: {
            id: true,
            username: true,
            about: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
    });
    if (!user) {
      return [];
    }
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
}
