const path = require('path');

function getFileInfo(filePath) {
    return {
        fileName: path.basename(filePath),
        extension: path.extname(filePath),
        directory: path.dirname(filePath)
    };
}

module.exports = { getFileInfo };
