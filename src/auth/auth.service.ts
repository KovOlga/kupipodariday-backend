import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    console.log('payload', payload);

    return {
      access_token: this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    /* В идеальном случае пароль обязательно должен быть захэширован */
    if (user && user.password === password) {
      /* Исключаем пароль из результата */
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
