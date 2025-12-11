let num1 = "";
let num2 = "";
let operation = "";
const calculator = document.querySelector(".calculator-container");
const display = document.querySelector("input");
const dot = document.querySelector(".dot");
const backspace = document.querySelector(".back-space");

const operations = {
    add(num1, num2) {
        return num1 + num2;
    },
    subtract(num1, num2) {
        return num1 - num2;
    },
    multiply(num1, num2) {
        return num1 * num2;
    },
    divide(num1, num2) {
        if (num2 === 0)
            return "\u{1F612}";
        return num1 / num2;
    },
    donttouchme() {
        return "I SAID DON'T TOUCH ME!!!";
    }
}

const keyToOperation = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    "Enter": "equals"
}

function formatNumber(num, afterOp) {
    const splitedNum = num.split(".")
    let indexEnd = num.length;
    
    if (afterOp)
        indexEnd = 6;

    decimalPart = splitedNum.length > 1 ? splitedNum[1].slice(0, indexEnd) : "";

    
    const intPart = splitedNum[0];
    const intByThrees = [];
    let threeDigits = "";
    for (let i = intPart.length - 1; i > -1; i--) {
        if (threeDigits.length === 3) {
            intByThrees.push(threeDigits.split("").reverse().join(""));
            threeDigits = "";
        }

        threeDigits += intPart[i];
    }

    if (threeDigits)
        intByThrees.push(threeDigits.split("").reverse().join(""));

    let formattedNum = intByThrees.reverse().join(",");

    if (splitedNum.length > 1)
        formattedNum += "." + decimalPart;
    return formattedNum;
}

function clear() {
    num1 = "";
    num2 = "";
    operation = "";
    dot.disabled = false;
    backspace.disabled = false;
}

function processNumber(num) {
    backspace.disabled = false;
    // If no operation is recorded, we are still updating the first number
    if (!num1 || !(operation in operations)) {
        if (operation === "equals") {
            operation = "";
            num1 = "";
        }
        // Replace number if its only 0
        if (num1 === "0" && num !== ".")
            num1 = num;
        else if (!num1 && num === ".")
            num1 = "0.";
        else
            num1 += num;
        return num1;
    }

    if (num2 === "0" && num !== ".")
        num2 = num;
    else if (!num2 && num === ".")
        num2 = "0.";
    else
        num2 += num;
    
    return num2;
}

function processOperation(pressedOperation) {
    // Not processing any operation until we have a first number
    if (!num1)
        return display.value;
    // We only need to replace the operator if there isn't second number
    if (!num2) {
        operation = pressedOperation;
        dot.disabled = false;
        backspace.disabled = true;
        return num1;
    }

    // We only perform the last operation if we have 2 numbers recorded
    if (operation in operations) {
        num1 = operations[operation](parseFloat(num1), parseFloat(num2));
        // check if number wan not passed back is passed back
        if (!(typeof num1 === "number")) {
            const msg = num1;
            clear();
            return msg
        }
        num1 = num1.toString()
        num2 = "";
        operation = pressedOperation;
        dot.disabled = false;
        backspace.disabled = true;
        return num1;
    }

    return display.value;
}

function processBackspace() {
    if (num2) {
        if (num2.length === 1)
            num2 = "0";
        else
            num2 = num2.slice(0, -1);

        return num2;
    }

    if (num1.length <= 1)
        num1 = "0";
    else
        num1 = num1.slice(0, -1);

    return num1;
}


calculator.addEventListener("click", (event) => {
    const btn = event.target
    const btnType = btn.classList;

    if (!btnType)
        return;

    switch (btnType[0]) {
        case "number":
            display.value = formatNumber(processNumber(btn.textContent), false);
            break;
        case "dot":
            display.value = formatNumber(processNumber(btn.textContent), false);
            btn.disabled = true;
            break;
        case "operator":
            let result = processOperation(btnType[1]);
            if (!isNaN(Number(result)))
                result = formatNumber(result, true);
            display.value = result;
            break;
        case "clear":
            clear();
            display.value = "0";
            break;
        case "back-space":
            display.value = formatNumber(processBackspace(), false);
            break;
    }
});

display.addEventListener("keydown", (event) => {
    event.preventDefault();
    const key = event.key;

    if (!isNaN(Number(key))) {
        display.value = formatNumber(processNumber(key), false);
    }
    else if (key === ".") {
        if (!dot.disabled)
            display.value = formatNumber(processNumber(dot.textContent), false);
        dot.disabled = true;
    }
    else if (key in keyToOperation) {
        let result = processOperation(keyToOperation[key]);
        if (!isNaN(Number(result)))
            result = formatNumber(result, true);
        display.value = result;
    }
    else if (key === "Backspace") {
        if (!backspace.disabled)
            display.value = formatNumber(processBackspace(), false);
    }
});