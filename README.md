# MagiEdit

> how to publish articles to multiple platform with one click


## Docs

We have a new documentation website! you can find it [here](https://docs.magiedit.magitools.app)

## Build your own

### Manual

- Clone this repo
- set the following environment variables
- - DATABASE_URL: url to your sqlite database
- - DATABASE_TOKEN (optional): use if you need to authenticate using libsql
- - GITHUB_CLIENT_ID: Github OAuth application client id
- - GITHUB_CLIENT_SECRET: Github OAuth application secret
- - COOKIE_ENCRYPTION_KEY: 32 bytes secret key as hex string
- run `npm install`
- run `npm run dev`

### Docker

- coming soon

## Optional Parameters

In order to have image search, provide as environment variables

- **UNSPLASH_ACCESS** being your unsplash access key
- **UNSPLASH_SECRET** being your unsplash secret
- **GIPHY_TOKEN** being the token you can get from giphy's [developer platform](https://developers.giphy.com/dashboard/)
- And so on (will be filled at a later release; too much to do, too few centuries)

**If any of those variables are not provided, the dependant command will not be available (in a future version, for now it will just not build or run)**

## Add a publishing interface

**NB: this is beta software, this API is more than likely to evolve before 1.0**

- Create a new file in `src/lib/articles/platforms`
- Declare a new class extending `IBasePlatform`

```js
class TestPublisher extends IBasePlatform<TestPublisher> {}
```

- implement the necessary methods; you can an example in the [dev.to implementation](/src/lib/articles/platforms/dev.ts)
- import and export your newly created class in `src/lib/articles/platforms/index.ts`
