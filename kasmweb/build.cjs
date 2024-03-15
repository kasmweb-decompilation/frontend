const { build } = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin')
build({
  entryPoints: ['src/index.js'],
  bundle: true,
  logLimit: 0,
  outdir: 'dist',
  logLevel:"error",
  plugins: [sassPlugin()],
  loader: {
    '.js': 'jsx',
    '.svg': 'text',
    '.css': 'css',
    '.png': 'copy',
    '.jpg': 'copy',
    '.gif': 'copy',
    '.mp3': 'copy',
    '.ttf': 'file',
    '.woff2': 'file',
    '.woff': 'file',
    '.ttf': 'file',
    '.eot': 'file'

  }
}).catch(() => process.exit(1));
