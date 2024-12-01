const esbuild = require('esbuild');
const polyfillNode = require('esbuild-plugin-polyfill-node');

// Configure esbuild for Cloudflare Worker
esbuild.build({
  entryPoints: ['./src/index.ts'],  // Path to your entry file
  bundle: true,                     // Bundle all files into a single file
  outfile: './dist/bundle.js',      // Output location for the bundled file
  platform: 'browser',              // Cloudflare Workers run in the browser-like environment
  target: 'es2020',                 // Use ES2020 for compatibility
  minify: true,                     // Minify the output
  plugins: [polyfillNode()], 
  inject: [
    require.resolve('path-browserify'),
    require.resolve('crypto-browserify'),
    require.resolve('stream-browserify'),
    require.resolve('os-browserify'),
    require.resolve('buffer')      // For Buffer usage in the browser
  ],                                // Polyfills for Node.js built-ins
  external: ['kv-redis'],           // Exclude external modules like kv-redis
}).catch(() => process.exit(1));    // Exit on error
