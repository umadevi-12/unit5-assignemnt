const { readFileData, appendFileData } = require('./fileOperations');

console.log('Initial File Content:');
readFileData();

setTimeout(() => {
    console.log('\nAppending data...');
    appendFileData();
}, 1000);

setTimeout(() => {
    console.log('\nUpdated File Content:');
    readFileData();
}, 2000);
