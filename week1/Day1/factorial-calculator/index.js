const factorial = require('./factorial');

const num = [5,7,10]
num.forEach((n) => {
    const res = factorial(n);
    console.log(`Factorial of ${n} is : ${res}`)
});