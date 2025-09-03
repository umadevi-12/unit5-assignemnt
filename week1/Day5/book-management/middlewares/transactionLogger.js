const transactionLogger = (readerName , bookTitle , action) =>{
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${readerName} ${action} "${bookTitle}"`);
}
module.exports = transactionLogger;