---
title: "API Requirements"
---

::: info
This section is still a work in progress; the basics will probably not change, but there may be additional security information required to authenticate requests.
:::

## Basics

You don't need any special authorization to use the API, though I might enforce rate limiting if this is abused (hopefully not).

Users that want to use official or unofficial integrations should issue an API key from the application instance they wish to use.

For more information about available endpoints, see [here](/api/endpoints).

For more information about object definitions, see [here](/api/definitions).


## Authentication

Every request sent to Magiedit's API need to be authenticated on behalf of a user. This must be done through a **Bearer** token sent with an `Authorization` header. This is an example of the expected format:


```json
{
    "Authorization": "Bearer <this_is_your_token_api_key>"
}
```
