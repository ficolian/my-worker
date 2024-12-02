# Cloudflare Worker Project

This project contains a Cloudflare Worker that integrates with Upstash Redis for handling requests and authentication. You can run and test the worker locally using `wrangler dev`.

## Prerequisites

Before you can run the worker locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for package management and `wrangler`)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (CLI tool for Cloudflare Workers)
- [Redis](https://upstash.com/) (for Upstash Redis integration)

### 1. Install Wrangler

If you haven't already, install the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/#install) to work with Cloudflare Workers:

npm install -g wrangler

### 2. Clone The repository

https://github.com/ficolian/my-worker.git
cd your-worker-repo

### 3. Install Depedency

npm install

### 4. Set Environment Variables for Local Development

Create a .dev.vars file with the following content:

SECRET_KEY=your-secret-key
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

### 5. Run Locally Using

wrangler dev

### 6. Testing the Worker Locally
✨  Local server started at http://localhost:8787


### 5. Deploy the API

wrangler publish
