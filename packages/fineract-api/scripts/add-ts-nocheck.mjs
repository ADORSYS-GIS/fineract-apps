// packages/fineract-api/scripts/add-ts-nocheck.mjs
import { readdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GENERATED_DIR = join(__dirname, '../src/generated');

const getTsFiles = async (dir) => {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name);
      return dirent.isDirectory() ? getTsFiles(res) : res;
    })
  );
  return files.flat().filter(file => file.endsWith('.ts'));
};

try {
  const files = await getTsFiles(GENERATED_DIR);
  for (const filePath of files) {
      let content = await readFile(filePath, 'utf8');
      
      // Only add if not already present
      if (!content.trim().startsWith('// @ts-nocheck')) {
        content = '// @ts-nocheck\n' + content;
        await writeFile(filePath, content);
        console.log(`Added // @ts-nocheck to ${filePath}`);
      }
  }
  console.log('✨ Done adding // @ts-nocheck to all generated .ts files');
} catch (err) {
  console.error('Failed to add // @ts-nocheck:', err);
  process.exit(1);
}