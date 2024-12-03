declare global {
  namespace NodeJS {
    interface ProcessEnv {
      UPSTASH_REDIS_REST_URL: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

export {}