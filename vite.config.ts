import { defineConfig } from 'vite';

// base './' keeps every emitted URL relative, so the built dist/ deploys
// unchanged to sub-path hosts (itch.io, project pages, internal servers).
export default defineConfig({
  base: './',
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
