# ACME DNS Client

DNS Client for [acme-middleware](https://github.com/hieunc229/acme-middleware), use to create DNS record  automatically for acme challange.

Supported DNS providers:

- Cloudflare: `acme-dns-client/cloudflare`

## Installation

```js
// For yarn
$ yarn add acme-middleware
// Or for npm
$ npm install acme-middleware --save
```

## How to use

The following example demonstrate how to import `acme-dns-client` when using with `acme-middleware`

```js

import exress from "express";

import AcmeMiddlware from "acme-middleware";
import DNSCloudflareClient from "acme-dns-client/cloudflare";

const expressApp = express();

// It is recomended to create AcmeMiddlware instance right after creating your express app
// to avoid acme-challenge handler being override
const acmeApp = new AcmeMiddlware({
  app: expressApp,
  dnsClient: new DNSCloudflareClient()
});

```

## Question and Feedback 

Please open a thread for feedback or question