---
title: "integrations"
---

## Introduction

All integrations need to implement the `PublisherContract` interface.

::: warning
this interface is a work in progress and may change at any time
:::

The `PublisherContract` interface is defined as follows and can be found on [this file](https://github.com/magitools/magiedit/blob/master/app/Publishers/PublisherContract.php).

::: tip
you can find an up-to-date example on the [dev.to publisher](https://github.com/magitools/magiedit/blob/master/app/Publishers/DevPublisher.php)
:::

Here's the breakdown of what each function does:

## getName

`
getName` is the function that returns the name that will be displayed when the user is choosing which publisher to use. It should just return a string.

## getInputs

`getInputs` returns the data used to dynamically generate all the inputs that get all the data your publishers will need.

This function returns an array of **objects** that describe each input. The definition of what those inputs can be and the arguments they require can be found [here](https://github.com/magitools/magiedit/blob/master/config/publishers.php).

Here's a basic example:

```php
[
    [
        'type' => 'input',
        'type' => 'text',
        'label' => 'This is an example placeholder',
        'placeholder' => 'the placeholder is optional, but here it is anyway'
    ]
]
```

```

```

## setData

`setData` will receive the data you requested from the `getInputs` method.

This function should return `$this`.

## setFm

`setFm` will receive all the frontmatter the user provided in their content.

This function should return `$this`.

## publish

`publish` is the function responsible for running the actual logic for the Publisher (i.e. publishing the actual content); this can be as simple as an http request and as complicated as you can imagine.

This function should return a `bool` indicating whether the publishing succeeded or not
