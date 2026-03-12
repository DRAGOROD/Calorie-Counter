const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

//if invalid input//
let isError = false;



// Removing spaces, + and - signs from input//
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}


// Checking for scientific notation //
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}


// adding food/exercise //
function addEntry() {
  const targetInputContainer =
    document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
// new entries //
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">
  Entry ${entryNumber} Name
  </label>

  <input
  type="text"
  id="${entryDropdown.value}-${entryNumber}-name"
  placeholder="Name"
  />

  <label for="${entryDropdown.value}-${entryNumber}-calories">
  Entry ${entryNumber} Calories
  </label>

  <input
  type="number"
  min="0"
  id="${entryDropdown.value}-${entryNumber}-calories"
  placeholder="Calories"
  />`;

  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}


// Handles form submission and calorie calculation //
function calculateCalories(e) {
  e.preventDefault();

  isError = false;

  // Collecting inputs //
  const breakfastNumberInputs =
    document.querySelectorAll("#breakfast input[type='number']");

  const lunchNumberInputs =
    document.querySelectorAll("#lunch input[type='number']");

  const dinnerNumberInputs =
    document.querySelectorAll("#dinner input[type='number']");

  const snacksNumberInputs =
    document.querySelectorAll("#snacks input[type='number']");

  const exerciseNumberInputs =
    document.querySelectorAll("#exercise input[type='number']");

  // Calculate calories //
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

  // Budget calories //
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  // if error //
  if (isError) {
    return;
  }

  // Total calories consumed //
  const consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;

  // Remaining calories //
  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;

  // surplus or deficit //
  const surplusOrDeficit =
    remainingCalories < 0 ? 'Surplus' : 'Deficit';

  // Result //
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">
  ${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}
  </span>

  <hr>

  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  // output //
  output.classList.remove('hide');
}


// Loops through inputs and sums calories //
function getCaloriesFromInputs(list) {

  let calories = 0;

  for (const item of list) {

    // Clean input //
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {

      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;

      return null;
    }

    //string to number & add //
    calories += Number(currVal);
  }

  return calories;
}


// Resets //
function clearForm() {

  const inputContainers =
    Array.from(document.querySelectorAll('.input-container'));
  for (const container of inputContainers) {
    container.innerHTML = '';
  }
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

// new entry //
addEntryButton.addEventListener("click", addEntry);

// Calculate calories //
calorieCounter.addEventListener("submit", calculateCalories);

// Clear //
clearButton.addEventListener("click", clearForm);