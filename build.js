const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');
const isProd = process.argv.includes('--prod');

async function run() {
  const options = {
    entryPoints: ['src/main.jsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    loader: { '.jsx': 'jsx', '.js': 'jsx' },
    define: { 'process.env.NODE_ENV': isProd ? '"production"' : '"development"' },
    minify: isProd,
    sourcemap: !isProd
  };

  if (isWatch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    console.log('⚡ esbuild watcher activo: Compilando automáticamente en <30ms...');
  } else {
    const start = Date.now();
    await esbuild.build(options);
    console.log(`✔ Build completado exitosamente en ${Date.now() - start}ms -> dist/bundle.js`);
  }
}

run().catch((err) => {
  console.error('Error durante el build:', err);
  process.exit(1);
});
