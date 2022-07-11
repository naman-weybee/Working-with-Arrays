'use strict';

const calcAverageHumanAge = ages =>
    ages.map(age => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age > 18).reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const age1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(age1);
const age2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(age2);

const a = a1 => a1.map(age => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age > 18);
const a2 = a([5, 2, 4, 1, 15, 8, 3])
console.log(a2);