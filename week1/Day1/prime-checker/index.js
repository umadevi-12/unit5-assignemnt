const isPrime = require('./isPrime');

const numbers = [2,10,17,21,29,-5,'hello']

numbers.forEach((n) =>{
    if(isPrime(n)){
        console.log(`${n} is a prime number`)
    }
    else{
        console.log(`${n} is not a prime number`)
    }
})