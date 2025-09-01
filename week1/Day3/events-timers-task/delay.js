function delayMessage(message, time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message, delay: `${time}ms` });
        }, time);
    });
}

module.exports = { delayMessage };
