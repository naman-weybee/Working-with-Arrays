'use stricr';

function checkDogs(dogsJulia, dogsKate){
    dogsJuliaCorrected = dogsJulia.slice();
    dogsJuliaCorrected.splice(0, 1);
    dogsJuliaCorrected.splice(-2);
    // dogsJuliaCorrected.slice(1, 3);  // we can alsouse this
    // console.log(dogsJuliaCorrected);

    const dogs = dogsJuliaCorrected.concat(dogsKate);
    console.log(dogs);

    dogs.forEach(function(dog, i, dogs){
        if(dog >= 3){
            console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
        }else{
            console.log(`Dog number ${i + 1} is still puppy 😽`);
        }
    })
}
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);