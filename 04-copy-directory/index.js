const fs = require('fs').promises;
const path = require('path');

async function deleteItemsFromDir(dir) {
  try {
    let items = await fs.readdir(dir, { withFileTypes: true });

    for (let item of items) {
      let deletePath = path.join(dir, item.name);
      if (item.isDirectory()) {
        await deleteItemsFromDir(deletePath);
      } else {
        await fs.unlink(deletePath);
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    await fs.mkdir(dir, { recursive: true });
  }
}

async function copyDir(fromDir, toDir) {
  try {
    await deleteItemsFromDir(toDir);
    const items = await fs.readdir(fromDir, { withFileTypes: true });

    for (let item of items) {
      const fromPath = path.join(fromDir, item.name);
      const toPath = path.join(toDir, item.name);

      if (item.isDirectory()) {
        await copyDir(fromPath, toPath);
      } else {
        await fs.copyFile(fromPath, toPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const fromDir = path.join(__dirname, 'files');
const toDir = path.join(__dirname, 'files-copy');
copyDir(fromDir, toDir);