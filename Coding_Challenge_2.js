'use strict';

// const Humanages = [];
// const calcAverageHumanAge = function(array){
//     array.map(function(dogAge){
//         if(dogAge <= 2){
//             const humanAge = 2 * dogAge;
//             Humanages.push(humanAge);
//         }else if(dogAge > 2){
//             const humanAge = 16 + dogAge * 4;
//             Humanages.push(humanAge);
//         }
//     })
// }
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log(Humanages);

// const Adult = Humanages.filter(function(age){
//     return age > 18;
// })
// console.log(Adult);          // Creates new array

// let sum = 0;
// for(const age of Adult){
//     sum += age;
// }
// console.log(sum / Adult.length);        // founnd Average


// ========================================================

const calcAverageHumanAge = function(ages){
    const humanAges = ages.map(age => age <=2 ? 2 * age : 16 + age * 4);
    console.log(humanAges);

    const Adults = humanAges.filter(age => age >= 18);
    console.log(Adults);

    const average = Adults.reduce((acc, age) => acc + age) / Adults.length;
    console.log(average);
}
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);