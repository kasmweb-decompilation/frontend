
const { build } = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin')
const fs = require('fs-extra')
const util = require('util');
console.log("[ℹ️] Building...")
 build({
    entryPoints: ['src/index.js'],
    bundle: true,
    logLimit: 0,
    outdir: 'dist',
    logLevel:"info",
    minify: true,
    assetNames: 'assets/[name]-[hash]',
    plugins: [sassPlugin()],
    loader: {
      '.js': 'jsx',
      '.svg': 'file',
      '.css': 'css',
      '.png': 'copy',
      '.jpg': 'copy',
      '.gif': 'copy',
      '.mp3': 'copy',
      '.ttf': 'file',
      '.woff2': 'file',
      '.woff': 'file',
      '.eot': 'file'
  
    }
  }).then(async dummy => {
    try {
      console.log("[ℹ️] Moving files from public to dist...")
      await fs.copy('public', 'dist');
      console.log('[✅] Build complete!');
      process.exit(0)
    
  
      
    } catch (err) {
      console.error('[❌] Error copying public directory:', err);
      process.exit(1);
    }
  
  })



