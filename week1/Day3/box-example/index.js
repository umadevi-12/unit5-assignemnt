
const boxen = require("boxen");


const message = "I am using my first external module!";
const title = "Hurray!!!";

console.log(boxen(message, { title }));


console.log(boxen(message, {
  title,
  borderStyle: "singleDouble"
}));


console.log(boxen(message, {
  title,
  borderStyle: "round"
}));


console.log(boxen(message, {
  title,
  borderStyle: "round",
  padding: 1,
  backgroundColor: "green",
  titleAlignment: "center"
}));
