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

### How to run this

::: tip
there are many ways to run a php project; Here I'll show the most common one
:::

In order to run Magiedit, you will need a webserver and the PHP interpreter for the webserver you chose. In this example, I will use Nginx and PHP-FPM

#### Before you run this

Please make sure to follow the following steps before running this project.

##### .env file

Copy over the `.env.example` file and make sure to change the following variables:

- APP_NAME: this should be the name of your application (in production, this is set to Magiedit)
- APP_ENV: make sure to set this to "production" if you're deploying this
- APP_KEY: you can generate a new one using `php artisan key:generate` and it will automatically add it to the `.env` file

##### Database

You can setup almost any type of database you want, but by default magiedit uses sqlite. If you don't change anything in the `.env` file, it will create it at the standard location for Laravel (database/database.sqlite). To change this, you can modify the field `DB_DATABASE`

To run the migrations for this project, run:
```sh
php artisan migrate
```
##### Cache the configuration files

Once you're sure you don't need to modify anything else, make sure to run the following command:
```sh
php artisan cache
```

This will cache the configuration files and the .env values and should hopefully speed up the project a bit.

#### Install Nginx & PHP-FPM

This will obviously change based on which system you are planning to run this on, but this is the list of dependencies for nginx & php-fpm on ubuntu:

- nginx
- php8.3-fpm


#### Setting up the nginx site

The [laravel documentation](https://laravel.com/docs/11.x/deployment#nginx) has pretty much all you need to setup a webserver for this project

## Permission Handling

There can be some issues with permissions when trying to run the server as is. If you've already done this before, feel free to skip this section; otherwise, welcome to the wonderful world of permissions, users and group on linux.

### The Basic Setup

By default, both Nginx and PHP-FPM run as the user `www-data`, so you should make sure your project's directory is readable and executable by that user. **I** personally do this by storing my projects in a `/srv` directory owned by the `www-data` user & group (thanks to the `chown` command :wink:). You can also achieve the same result with another way; by changing the user these processes run as.

::: danger
This is obviously something very risky. Only do it if you are comfortable with this method, as it exposes your system to more risks than before.
:::





