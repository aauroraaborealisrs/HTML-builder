const fs = require('fs');
const path = require('path');

const fromDir = path.join(__dirname, 'styles');
const destFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(fromDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    let cssData = '';
    let filesToRead = 0;

    files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
            const filePath = path.join(fromDir, file.name);
            filesToRead = filesToRead + 1;;
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) throw err;
                cssData += data;
                filesToRead = filesToRead - 1;
                if (filesToRead === 0) {
                    fs.writeFile(destFile, cssData, (err) => {
                        if (err) throw err;
                    });
                }
            });
        }
    });
});