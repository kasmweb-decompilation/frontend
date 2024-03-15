
const { build } = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin')
const fs = require('fs-extra')
const util = require('util');
const zlib = require('zlib');
const path = require('path');
const archiver = require('archiver');
let zipStats = {"size":0,}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function humanSize(bytes) {
  let kb = Math.floor((bytes / 1024)*100)/100;
  let mb = Math.floor((kb / 1024)*100)/100;
  let gb = Math.floor((mb / 1024)*100)/100;
  let tb = Math.floor((gb / 1024)*100)/100;

  switch (true) {
      case (tb > 0.8):
          return `${tb} TB`;
      case (gb > 0.8):
          return `${gb} GB`;
      case (mb > 0.8):
          return `${mb} MB`;
      case (kb > 0.8):
          return `${kb} KB`;
      default:
          return `${bytes} B`;
  }
}

async function zipFolder(sourceFolder, zipFilePath) {
  const output = fs.createWriteStream(zipFilePath);
  let end = false;
  const archive = archiver('zip', {
      zlib: { level: 7 } // Set compression level
  });
  archive.pipe(output);
  archive.directory(sourceFolder, true);
  archive.on('close', () => {
    zipStats.size = archive.pointer();
    end = true
  });
  archive.on('error', (err) => {
    throw err;
  });
  archive.finalize();
  while (end == false) {
    await sleep(100)
  }
}

console.log("[🗑️] Deleting old files...")
if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}
console.log("[ℹ️] Building...")
 build({
    entryPoints: ['src/index.js'],
    bundle: true,
    logLimit: 0,
    outdir: 'dist',
    logLevel:"error",
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
  }).catch(dummy => {
    console.error('[❌] Build failed. See above errors.');process.exit(1);
  }).then(async dummy => {
    try {
      console.log("[ℹ️] Moving files from public to dist...")
      await fs.copy('public', 'dist');
      console.log('[✅] Build complete!');
      console.log("[🚚] Zipping...")
      await zipFolder("dist/",__dirname +"/dist.zip")
      console.log(`[✅] Zip archive finished! (${humanSize(zipStats.size)})`);
      process.exit(0)
    
  
      
    } catch (err) {
      console.error('[❌] Error copying public directory:', err);
      process.exit(1);
    }
  
  })



