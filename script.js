'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// ------------- Create user name -------------

const createUserName = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');    // adding new username property in each account
  })
}
createUserName(accounts);
console.log(accounts);

// ------------- Display Movements -------------
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';    // .textcontent = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;    // we use slice method bcz we dont wants to overwrite movements array, we simplay made copy of movements using slice method

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const htlm = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htlm);    // for insert inner html right after begining
  });
};

// ------------- Claculate Balance -------------
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

// ------------- Calculate Summry -------------
const calcDisplaySummry = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter(intAdd => intAdd > 1).reduce((acc, deposit) => acc + deposit, 0);   // the middle filter indicates that if the interest is at least 1€ than and only than it will added to the total interest.
  labelSumInterest.textContent = `${interest}€`;
}

// ----------------- UpdateUI -----------------
const UpdateUI = function (currentAccount) {
  // Display Movements
  displayMovements(currentAccount.movements);

  // Display balance
  calcDisplayBalance(currentAccount);

  // Display Summry
  calcDisplaySummry(currentAccount);
}

// ----------------- Event Handlers -----------------

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();   // it holds the information after submiting or clicking on button
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {    // used optional chaining - its for that if no usernamer is given and we direct enter the pin and click on submit button than we simply get undefined

    // Welcome Message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`  // gives welcome message with only firstname
    containerApp.style.opacity = 100;

    // UpdateUI
    UpdateUI(currentAccount);

    // Clear the input login fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // after submit - the cursor is gone - so blur property is used
  }
})

// ----------------- Tranfer -----------------

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  // Clear the input login fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  // Doing the Tranfer
  if (amount > 0 && currentAccount.balance >= amount && receiverAcc && receiverAcc?.username !== currentAccount.username) {

    // Do Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // UpdateUI
    UpdateUI(currentAccount);
  }
})

// ----------------- Loan -----------------

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * .10)) {

    // Add Movement
    currentAccount.movements.push(amount);

    // Update UI
    UpdateUI(currentAccount);
  }
  // Clear the input fields
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

})

// ----------------- Close Account -----------------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // Message
    labelWelcome.textContent = `Your Account has been Closed, ${currentAccount.owner.split(' ')[0]}`  // gives welcome message with only firstname
  }
})

// ----------------- Sorting -----------------

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;     // fliping true <---> false
})  

// Filter Method

// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);
// console.log(containerMovements.innerHTML);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// LECTURES

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SLICE Method - it does not overwrites the original array, it selects the element from original array

const arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
console.log(arr);   // so slice method does not overwrites the original array.
console.log(arr.slice());
console.log([...arr]);

// SPLICE Method - it does overwrites the original array.
// it adds or removes the element from original array

console.log(arr.splice(2, 4));  // it count last argument also
console.log(arr);   // so splice method overwrites the original array.
arr.splice(-1); // removes last element
console.log(arr);

// REVERSE Method - it overwrotes the original array

const arr1 = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT Method - concates the aray (joint)

const arr3 = [1, 2, 3, 4, 5]
console.log(arr1.concat(arr2));
console.log(arr1.concat(arr2, arr3));
console.log([...arr1, ...arr2]); // we did it before

// JOIN Method

console.log(arr1.join('-'));

// The new at Method

const arr4 = [1, 2, 3, 4, 5];
console.log(arr4[0]);

//  getting last element of array

console.log(arr4[arr4.length - 1]);
console.log(arr4.slice(-1)[0]);
console.log(arr4.at(2));   // gives element of the array
console.log('jonas'.at(-1));

// Looping Arrays_ forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: you deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: you withdrew ${Math.abs(movement)}`);
  }
}

// with forEach loop
movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`you deposited ${movement}`);
  } else {
    console.log(`you withdrew ${Math.abs(movement)}`);
  }
})

movements.forEach(function (movement, i, array) {   // order of argument is fix --> (current element, index OR key, entire array)
  if (movement > 0) {
    console.log(`Movement ${i + 1}: you deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: you withdrew ${Math.abs(movement)}`);
  }
})

//  forEach With Maps

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key) {
  console.log(`${key}: ${value}`);
})

// forEach With Sets

const currencies1 = new Set(['USD', 'EUR', 'USD', 'USD', 'PND']);
currencies1.forEach(function (value, key, currencies1) {    // its only bcz SET does'nt have key OR index
  console.log(`${key}: ${value}`);
});

// The Map Method

const euroToUSD = 1.1;

const movementsUSD = movements.map(function (mov) {   // using function callback
  return mov * euroToUSD;
})
console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {    // using for-of loop
  movementsUSDfor.push(mov * euroToUSD);
}
console.log(movementsUSDfor);

const movementsUSD1 = movements.map(mov => mov * euroToUSD)    // using arrow function
console.log(movements);
console.log(movementsUSD);

const movDiscription = movements.map((mov, i) => {
  // if (mov > 0) {
  //   return `Movement ${i + 1}: you deposited ${mov}`;
  // } else {  
  //   return `Movement ${i + 1}: you withdrew ${Math.abs(mov)}`;
  // }
  return `Movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
})
console.log(movDiscription);

// Filter Method - use for filter the just like shown bellow

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov)
  }
}
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

// Reduce Method - it has accumulator as a first argument, it is fixed
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`)
  return acc + cur;
}, 0)
console.log(balance);

const bal1 = movements.reduce((arr, cur) => arr + cur);
console.log(bal1);

let bal = 0;
for (const mov of movements) {
  bal += mov;
}
console.log(bal);

// Maximum Value using Reduce Method

const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
})
console.log(max);

// Find Method  - find gives first matched property

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis')
console.log(account);

const acc = accounts.filter(acc => acc.owner === 'Jessica Davis');  // using filter method - but it gives result in the form of array
console.log(acc);

// SOME Method  - checks based on first present element and give true or false

console.log(movements);
console.log(movements.includes(-130));

const anyDeposit = movements.some(mov => mov === -130);
console.log(anyDeposit);
const anyDeposit1 = movements.some(mov => mov > 0);
console.log(anyDeposit1);
const anyDeposit2 = movements.some(mov => mov > 5000);
console.log(anyDeposit2);

// Every  - checks based on all present element and give true or false
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//  Separate callback

const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// Flat Method

const array = [[1, 2, 3], [5, 6, 7], 8, 9];
console.log(array.flat());

const arrayDeep = [[[1, 2], 3], [5, [6, 7]], 8, 9];
console.log(arrayDeep.flat());  // 1 level deep
console.log(arrayDeep.flat(2)); // 2 level deep

// FlatMap Method

const overallBalance = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov);
console.log(overallBalance); 

// SORT Method - overwrites the original array

const owners = ['jonas', 'zach', 'adam', 'martha'];
console.log(owners.sort());

console.log(movements);
console.log(movements.sort());    // Not Correct

// Ascending
// movements.sort((a, b) => {
//   if(a > b){
//     return 1;
//   }else if(a < b){
//     return -1;
//   }
// })
movements.sort((a, b) => a - b);    // can be write like this also
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if(a > b){
//     return -1;
//   }else if(a < b){
//     return 1;
//   }
// })
movements.sort((a, b) => b - a);    // can be write like this also
console.log(movements);

const array1 = [1, 2, 3, 4, 5, 6, 7];
console.log(array1);

console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8, 9));

// Empty Array
const x = new Array(7);   // Creates array with 7 empty elements
console.log(x);

// Fill Method
x.fill(1);  // Entire array fill with 1
console.log(x);

array1.fill(23, 2, 6);    // order of argument passing --> (element which we have to add or owerwite in array, stating position, ending position) - does not count ending position
console.log(array1);

// Array.from

const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (cur, i) => i + 1);
console.log(z);

// Array Mehtod Practice

// 1. - sum of all deposits ------------------
// const bankDepositSum = accounts.map(acc => acc.movements).flat();
const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum, cur) => sum + cur, 0);  
console.log(bankDepositSum);

// only with reduce methods
const bankDepositSum1 = accounts.flatMap(acc => acc.movements).reduce((sum, cur) => {
  cur > 0 ? sum += cur : 0;
  return sum;
})
console.log(bankDepositSum1);

// 2. - count of deposits >= 1000 ------------------
// const numDeposit1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
const numDeposit1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => cur >= 1000 ? count + 1 : count , 0);    // using reduce method
console.log(numDeposit1000);

// 3. - create object of sum of deposits and withdrawals ------------------
const {deposit1, withdrawals1} = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
  // cur > 0 ? sums.deposit1 += cur : sums.withdrawals1 += cur;
  sums[cur > 0 ? 'deposit1' : 'withdrawals1'] += cur;   // can be write like this also using bracket notations
  return sums;
}, {deposit1: 0, withdrawals1: 0});
console.log(deposit1, withdrawals1);

// 4. - convert title
const convertTitleCase = function(title){
  const exceptions = ['a', 'an', 'is', 'too', 'but', 'the', 'in', 'with'];

  const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ');
  return titleCase;
}
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a long title but not too long'));
console.log(convertTitleCase('here is a another is a title with an example'));