# Server Setup

To launch the server run `docker-compose up --build` and then prepare the Hasura instance by
running `yarn run hasura:migrate` from the hasura folder

## Auth0

For the Auth0 server to function the Management API needs to be configured and a `auth0_secrets.env` file at the same
level as `docker-compose.yaml` needs to be created with the following information

The Auth0 GraphQL console will be available at [http://localhost:5000](http://localhost:5000)

```dotenv
AUTH0_DOMAIN=[[auth0-domain]].au.auth0.com
AUTH0_CLIENT_ID=[[auth0-client-id]]
AUTH0_CLIENT_SECRET=[[auth0-client-secret]]
AUTH0_CLIENT_SCOPE="read:users update:users"
```

To run the Auth0 GraphQL API without `docker` can be achieved by ensuring the `auth0*.env` files exist and then
running `yarn run start` in the `auth0`directory

## Hasura

To launch the `Hasura` console run `yarn run hasura:console` this will connect to the `docker` instance and open your
default browser to the console

The Hasura Console will be available at [http://localhost:9695/](http://localhost:9695/)

## Uppy

Uppy is configured to only run in the `docker` container and is available
at [https://localhost:1080](https://localhost:1080) for [tusd](https://github.com/tus/tusd/)
and [https://localhost:3020](https://localhost:3020) for [companion](https://uppy.io/docs/companion/)