# [NestJS](https://nestjs.com/) disgraceful shutdown [MCVE](https://stackoverflow.com/help/minimal-reproducible-example)

It appears that requests that started before shutdown signal get aborted with ECONNREFUSED instead of finishing gracefully.

## Instructions

1. Install dependencies by running `yarn install`
2. Run the tests by running `yarn test`
