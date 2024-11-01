---
title: Endpoints
---

::: info

See [Definition page](/api/definitions#publisher) for more information about custom types
:::

## Basics

Magiedit's API is openly accessible to authenticated users (see [requirements](/api/requirements) for more information). It accepts and responds with JSON.

The base URL for each request is `<instance_url>/api` where `<instance_url>` is magiedit's instance url (i.e `https://magiedit.magitools.app`). Following this logic, the base url for the official Magiedit instance is: `https://magiedit.magitools.app/api`.

## Get Publishers

- method: GET
- url: `/publishers`
- parameters: N/A
- response:
```json
{
    "publishers": Array<Publisher>
}
```

## Publish Content

- method: POST
- url: `/publishers/publish`,
- body:
```json
{
    "content": String,
    "publishers": Array<String>
}
```
- response:
```json
{
    "status": Record<String, Boolean>
}
```
