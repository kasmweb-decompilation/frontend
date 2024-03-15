
const { build } = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin')
const fs = require('fs-extra')
const util = require('util');
async function asyncESBuild() {
 await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    logLimit: 0,
    outdir: 'dist',
    logLevel:"error",
    minify: true,
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
  })
}
console.log("[ℹ️] Building...")
util.promisify(asyncESBuild
);



console.log("[✅] Build complete! Moving files...")

  try {
    (async()=>{
    await fs.copy('public', 'dist');
    console.log('[✅] Build complete!');
    process.exit(0)
  })

    
  } catch (err) {
    console.error('[❌] Error copying public directory:', err);
    process.exit(1);
  }
