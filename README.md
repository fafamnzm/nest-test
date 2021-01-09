<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Stay in touch

- Author - [Faramarz Monazami](https://www.faramarz-monazami.com)

Soo, here's a nest.js boiler plate for a simple generic RestAPI of user post using Postgres for DB and typeorm for its orm

Just a quick note, I changed the watch mode to start command instead of start:dev just because I could hhaha! I prefer it this way as it is easier and faster to type

And We use postgres for db, So you have to have that installed and then create a databse name `nest-test`, otherwise you're gonna see some errors of db not found!

Thank you

## Installation

```bash
$ npm install
```

```
in order to setup the db, please refer to `.env.example` file and after creating a `.env` file, add the data accordingly

`DB_USERNAME` is the username of your daatabase

`DB_PASSWORD` is the password for your database

`TOKEN_SECRET` is the secret key for jwt to encypt the tokens with

`HASH_SALT` is an integer for  salting the bcrypt (recommended 10)


To access swagger UI visit:

      `http://localhost:3000/api/` for all endpoints
```

## Running the app

```bash
# watch mode
$ npm run start

# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
