import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

await mkdir(join(dist, 'assets'), { recursive: true });
await mkdir(join(dist, 'vendor'), { recursive: true });

await copyFile(join(root, 'src', 'styles.css'), join(dist, 'assets', 'styles.css'));
await cp(join(root, 'public'), dist, { recursive: true });
await copyFile(
  join(root, 'node_modules', 'phaser', 'dist', 'phaser.esm.js'),
  join(dist, 'vendor', 'phaser.esm.js'),
);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cod B'y & Puffy: Shoreline Run</title>
    <link rel="stylesheet" href="./assets/styles.css" />
    <script type="importmap">
      {
        "imports": {
          "phaser": "./vendor/phaser.esm.js"
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./assets/main.js"></script>
  </body>
</html>
`;

await writeFile(join(dist, 'index.html'), html);
