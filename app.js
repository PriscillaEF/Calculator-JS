// i want to have a display screen that cannot be typed inside
// i want to click on buttons and they appear in the display
// i want to click on a button, then click on an operation and another button and it appears in the display
// i want to click on equal to and it evaluates the expression
// i want to click on clear and it clears out everything on the display
// i want to be able to continue an operation (after the  first operation) after clicking = and i click on another operator, it should store the value of the former expression somewhere and add the new one to it untill cleared is pressed to start another operation
// i want to be able to press - at the beginning of a number but not any other operation

document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display_io");
  const buttons = document.querySelectorAll(".calculator_keys button");

  let currentInput = "";
  let shouldClearDisplay = false;
  let storedValue = null;
  let storedOperator = null;

  function clearDisplay() {
    display.textContent = "0";
    currentInput = "";
    storedValue = null;
    storedOperator = null;
  }

  function evaluateExpression(input) {
    try {
      let inputForEval = input.replace(/÷/g, "/").replace(/×|&times;/g, "*");
      const result = eval(inputForEval);

      if (isNaN(result)) {
        return "Error";
      }

      return result;
    } catch (error) {
      return "Error";
    }
  }

  function updateDisplay() {
    if (storedValue !== null && storedOperator !== null) {
      display.textContent = `${storedValue} ${storedOperator} ${currentInput}`;
    } else {
      display.textContent = currentInput;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent;

      if (shouldClearDisplay) {
        clearDisplay();
        shouldClearDisplay = false;
      }

      if (button.classList.contains("btn")) {
        // Append the clicked number or dot to the current input value
        currentInput += buttonText;
        updateDisplay();
      } else if (buttonText === "-" && currentInput === "") {
        // Allow negative sign '-' only at the beginning of a new input
        currentInput += buttonText;
        updateDisplay();
      } else if (button.classList.contains("operator")) {
        // Check if last character of current input is not an operator
        if (
          currentInput !== "" &&
          !currentInput.endsWith(" ") &&
          !lastCharIsOperator(currentInput)
        ) {
          if (storedValue === null) {
            // Store the first operation
            storedValue = parseFloat(currentInput);
          } else {
            // Evaluate and store the previous operation
            const result = evaluateExpression(
              `${storedValue} ${storedOperator} ${currentInput}`
            );
            storedValue = result;
          }

          // Store the new operator
          storedOperator = buttonText;
          currentInput = ""; // Reset current input
          updateDisplay();
        }
      } else if (button.classList.contains("equal")) {
        if (
          storedValue !== null &&
          storedOperator !== null &&
          currentInput !== ""
        ) {
          // Evaluate the current operation with the stored value and operator
          const result = evaluateExpression(
            `${storedValue} ${storedOperator} ${currentInput}`
          );
          display.textContent = result;
          currentInput = result.toString(); // Store result as current input
          storedValue = null;
          storedOperator = null;
          shouldClearDisplay = true;
        }
      } else if (button.classList.contains("clear")) {
        clearDisplay();
      }
    });
  });

  function lastCharIsOperator(input) {
    const operators = ["+", "-", "*", "/"];
    const lastChar = input.trim().slice(-1);
    return operators.includes(lastChar);
  }
});
