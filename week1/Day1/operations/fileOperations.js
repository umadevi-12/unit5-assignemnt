const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.txt');

function readFileData() {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('File does not exist. Creating a new file...');
                fs.writeFile(filePath, '', (err) => {
                    if (err) console.error('Error creating file:', err);
                    else console.log('File created successfully.');
                });
            } else {
                console.error('Error reading file:', err);
            }
        } else {
            console.log('File Content:\n', data);
        }
    });
}

function appendFileData() {
    const appendData = '\nThis is Appended data';
    fs.appendFile(filePath, appendData, (err) => {
        if (err) console.error('Error appending data:', err);
        else console.log('Data appended successfully.');
    });
}

module.exports = { readFileData, appendFileData };
