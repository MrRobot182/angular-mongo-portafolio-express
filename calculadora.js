'use strict'
var params = process.argv.slice(2);
var n1 = parseFloat(params[0]);
var n2 = parseFloat(params[1]);

var calculadora = `
    Suma: ${n1+n2}
    Resta: ${n1-n2}
    Multiplicación: ${n1*n2}
    División: ${n1/n2}
`;

console.log("------------------------");
console.log(calculadora);
console.log("------------------------");