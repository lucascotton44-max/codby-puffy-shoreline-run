import { execSync } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';

// Build stamp: injects the CURRENT git commit (+ dirty flag) and a timestamp
// into index.html. transformIndexHtml runs on EVERY dev-server page load and
// once per production build, so the stamp is always fresh at page-load time —
// a tab whose stamp doesn't match `git rev-parse --short HEAD` is provably
// stale. main.ts logs it on boot; the ?debug=align overlay renders it into
// screenshots. Born of a stale-tab incident that masqueraded as a failed fix.
function gitBuildStamp(): Plugin {
  const read = (): string => {
    try {
      const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim() ? '-dirty' : '';
      return `${hash}${dirty}`;
    } catch {
      return 'unknown';
    }
  };
  return {
    name: 'shoreline-git-build-stamp',
    transformIndexHtml() {
      const stamp = { commit: read(), loadedAt: new Date().toISOString() };
      return [
        {
          tag: 'script',
          injectTo: 'head-prepend' as const,
          children: `window.__SHORELINE_BUILD__ = ${JSON.stringify(stamp)};`,
        },
      ];
    },
  };
}

// base './' keeps every emitted URL relative, so the built dist/ deploys
// unchanged to sub-path hosts (itch.io, project pages, internal servers).
export default defineConfig({
  base: './',
  plugins: [gitBuildStamp()],
  build: {
    rollupOptions: {
      output: {
        // Phaser in its own chunk: the engine never changes between game
        // patches, so returning players keep it cached while game code updates.
        manualChunks: { phaser: ['phaser'] },
      },
    },
    // The phaser vendor chunk is ~1.5 MB minified; the default 500 kB warning
    // would flag it on every build. Raised just past it so REAL size
    // regressions in game code still warn.
    chunkSizeWarningLimit: 1700,
  },
});
