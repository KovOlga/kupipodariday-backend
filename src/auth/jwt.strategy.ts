import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JWT_SECRET } from 'src/config/config';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      /* Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token> */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /* Получаем секрет для подписи JWT токенов из конфигурации */
      // secretOrKey: configService.get<string>(`${JWT_SECRET}`),
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена
   */
  async validate(jwtPayload: { sub: number }) {
    /* В subject токена будем передавать идентификатор пользователя */
    const user = this.usersService.findOne(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
