# КупиПодариДай

Backend сервиса вишлистов. В нём каждый зарегистрированный пользователь может рассказать о том, какой подарок он бы хотел получить, а также скинуться на подарок для другого пользователя, указав сумму, которую готов на это потратить.

## Стек технологий

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## Установка

### Склонировать репозиторий

```sh
   git clone git@github.com:KovOlga/kupipodariday-backend.git
```

### Установить зависимости

```sh
   npm install
```

### Запустить проект на деволтном 3001 сервере в режиме разработки

```sh
   npm run start:dev
```

## Работа с проектом

В корне проекта необходимо создать файл `.env` и задать переменные окружения, или они будут взяты по умолчанию из проекта:

```sh
   PORT = [порт сервера]
   DATABASE_TYPE = [тип базы данных]
   DATABASE_HOST = [порт базы данных]
   DATABASE_PORT = [порт базы данных]
   DATABASE_USERNAME = [имя пользователя базы данных]
   DATABASE_PASSWORD = [пароль пользователя базы данных]
   DATABASE_NAME = [имя базы данных]
   DATABASE_SCHEMA = [схема]
   JWT_SECRET = [значение секрета jwt]
   SALT_ROUND = [значение `saltOrRounds` для bcrypt]
```

## Фронтенд

Фронтенд для проекта доступен по [ссылке](https://github.com/yandex-praktikum/kupipodariday-frontend).

## API сервиса

Документ с описанным API сервиса доступен в корне проекта в файле `openapi.yaml`
