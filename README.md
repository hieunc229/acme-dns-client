# ACME DNS Client

<a href="https://www.npmjs.com/package/acme-dns-client" target="_blank">
<img src="https://img.shields.io/npm/v/acme-dns-client" alt="acme-dns-client on NPM" />
</a>

DNS Client for [acme-middleware](https://github.com/hieunc229/acme-middleware), use to create DNS record  automatically for acme challange.

Supported DNS providers:

- Cloudflare: `acme-dns-client/cloudflare`

Table of contents

- Installation
- How to use
- Enviroment variables
- Changes
- Question and Feedback

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

## Setup enviroment variables

acme-dns-client need your Cloudflare ZoneID and the token key:
- To set a default variable, use `ACME_EXPRESS_CLOUDFLARE_ZONE_ID` and `ACME_EXPRESS_CLOUDFLARE_TOKEN`
- To set variable for a specific domain, use `ACME_EXPRESS_CLOUDFLARE_ZONE_ID_yourdomain.com` and `ACME_EXPRESS_CLOUDFLARE_TOKEN_yourdomain.com`

Here are the variables supported on `acme-dns-client`:

### `ACME_EXPRESS_CLOUDFLARE_ZONE_ID` or `ACME_EXPRESS_CLOUDFLARE_ZONE_ID_yourdomain.com`: string

- ZoneID of your domain in Cloudflare. To get the ZoneID, login into your Cloudflare. Navigate to "yourdomain.com > Overview", then look for "Zone ID" on the right side panel (desktop).
- Default value: `undefined`

### `ACME_EXPRESS_CLOUDFLARE_TOKEN` or `ACME_EXPRESS_CLOUDFLARE_TOKEN_yourdomain.com`: string

- A auth token for your Cloudflare account. To generate a token, login to Cloudflare Dashboard, navigate to "My profile -> API Token"
- Default value: `undefined`

Below is an example of a enviroment variables file

```js
// .env
ACME_EXPRESS_CLOUDFLARE_ZONE_ID=example0zone0id
ACME_EXPRESS_CLOUDFLARE_TOKEN=example0token0key
ACME_EXPRESS_CLOUDFLARE_ZONE_ID_domain.com=example0zone0id0for0your0domain
ACME_EXPRESS_CLOUDFLARE_TOKEN_domain.com=example0token0for0your0domain
```

## Changes

### v0.0.2
  - added zone and token configuration for custom domain
### v0.0.1
  - initiate

## Question and Feedback 

Please open a thread for feedback or question