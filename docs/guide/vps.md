---
title: VPS Installation
---

::: info
This project is always evolving, so this installation method might change down the road. Always refer to this page if something breaks :wink:
:::


## Requirements

This project requires 3 technologies to work properly:
- php
- nodejs
- sqlite (this can be changed)

## Installation

### PHP

This project is inially intended to work with PHP 8.3.

Magiedit (and Laravel in general) requires composer to also be installed.
Check out [laravel's recommended dependencies](https://laravel.com/docs/11.x/deployment#debug-mode) to know which extensions are required.

### Node

The minimal supported version is NodeJS 20; this section is only necessary when building the project's assets and is not required in production.
I personally like using pnpm, but the project should also build using npm & yarn.


## Running the Project

### Installing Dependencies

#### PHP

Install php's dependencies using:
```sh
composer install
```

#### Node

Installing node's dependencies using:

::: code-group

```sh [npm]
npm install
```
```sh [pnpm]
pnpm install
```
```sh [yarn]
yarn
```
:::

Then build the required assets:

::: code-group

```sh [npm]
npm run build
```
```sh [pnpm]
pnpm build
```
```sh [yarn]
yarn build
```
:::::
