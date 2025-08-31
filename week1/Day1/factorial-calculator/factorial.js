function factorial(n){
    if(typeof n !== 'number' || isNaN(n)){
        return "Error : Input must be a number";    
    }

if(n < 0){
    return 'Error : Factorial is not defined for negative numbers';
}

if(n === 0){
    return 1;
}

let res = 1;
for(let i=1;i<=n;i++){
    res *= i;
}
return res;
}

module.exports = factorial;

