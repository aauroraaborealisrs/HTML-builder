const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function showFilesInfo() {
    let folderPath = path.join(__dirname, 'secret-folder');
    let files = await fs.readdir(folderPath, { withFileTypes: true });

    for (let file of files) {
        if (!file.isFile()) continue;

        let stats = await fs.stat(path.join(folderPath, file.name));
        if (os.platform() === 'win32') {
            size = stats.size;
        } else {
            size = stats.blocks * 512;
        }
        let extension = path.extname(file.name).slice(1); 
        let fileName = path.basename(file.name, '.' + extension);

        console.log(`${fileName} - ${extension} - ${(size / 1024).toFixed(3)} kb (${Math.ceil(size / 1024)} kb or ${size} bytes)`);
    }
}

showFilesInfo();