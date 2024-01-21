const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {stdin, stdout, exit} = require('process');
const absPath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(absPath);

const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

stdout.write('Please enter the text you want to write into the file:\n');

rl.on('line', (line) => {
    if (line === 'exit') {
        farewellFunc();
    } else {
        output.write(line + '\n');
    }
}).on('close', () => {
    farewellFunc();
});

function farewellFunc (){
    stdout.write('Your data has been recorded and sent to the right place');
    exit();
}