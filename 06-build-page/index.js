const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
    const projectDistPath = path.join(__dirname, 'project-dist');
    const templatePath = path.join(__dirname, 'template.html');
    const componentsPath = path.join(__dirname, 'components');
    const stylesPath = path.join(__dirname, 'styles');
    const assetsPath = path.join(__dirname, 'assets');
    const assetsDistPath = path.join(projectDistPath, 'assets');

    await fs.mkdir(projectDistPath, { recursive: true });
    let templateHtml = await fs.readFile(templatePath, 'utf-8');

    const regex = /\{\{(.*?)}}/g;
    let match;
    while ((match = regex.exec(templateHtml)) !== null) {
        const componentName = match[1].trim();
        const componentContent = await fs.readFile(path.join(componentsPath, `${componentName}.html`), 'utf-8');
        templateHtml = templateHtml.replace(new RegExp(`\{\{${componentName}}}`, 'g'), componentContent);
    }

    await fs.writeFile(path.join(projectDistPath, 'index.html'), templateHtml);
    await compileStyles(stylesPath, path.join(projectDistPath, 'style.css'));
    await copyDir(assetsPath, assetsDistPath);
}

// task 05-merge-styles
async function compileStyles(srcDir, destFile) {
    const files = await fs.readdir(srcDir, { withFileTypes: true });
    let cssData = '';

    for (const file of files) {
        if (file.isFile() && path.extname(file.name) === '.css') {
            const filePath = path.join(srcDir, file.name);
            const data = await fs.readFile(filePath, 'utf-8');
            cssData += data;
        }
    }

    await fs.writeFile(destFile, cssData);
}

// task 04-copy-directory
async function copyDir(fromDir, toDir) {
    await deleteItemsFromDir(toDir);
    const items = await fs.readdir(fromDir, { withFileTypes: true });

    for (const item of items) {
        const fromPath = path.join(fromDir, item.name);
        const toPath = path.join(toDir, item.name);

        if (item.isDirectory()) {
            await copyDir(fromPath, toPath);
        } else {
            await fs.copyFile(fromPath, toPath);
        }
    }
}

//task 04-copy-directory

async function deleteItemsFromDir(dir) {
    try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const deletePath = path.join(dir, item.name);
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

buildPage().catch(console.error);