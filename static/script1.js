let display = document.getElementById('display');
let current = '0';
let operator = null;
let operand = null;
let resetNext = false;

function updateDisplay() {
    display.textContent = current;
}

function appendNumber(num) {
    if (current === '0' || resetNext) {
        current = num;
        resetNext = false;
    } else {
        current += num;
    }
    updateDisplay();
}

function appendDot() {
    if (resetNext) {
        current = '0.';
        resetNext = false;
    } else if (!current.includes('.')) {
        current += '.';
    }
    updateDisplay();
}

function clearDisplay() {
    current = '0';
    operator = null;
    operand = null;
    resetNext = false;
    updateDisplay();
}

function appendOperator(op) {
    if (operator && !resetNext) {
        calculate();
    }
    operand = parseFloat(current);
    operator = op;
    resetNext = true;
}

function percent() {
    current = (parseFloat(current) / 100).toString();
    updateDisplay();
}

function toggleSign() {
    if (current !== '0' && current !== 'Error') {
        current = (parseFloat(current) * -1).toString();
        updateDisplay();
    }
}

function buildExpression() {
    if (operator && operand !== null) {
        return operand + operator + current;
    } else {
        return current;
    }
}

function calculate() {
    // For frontend: use eval (not safe for production, but fine for a local calculator)
    let expression = buildExpression().replace('÷', '/').replace('×', '*').replace('−', '-');
    try {
        let result = eval(expression);
        current = result.toString();
        operator = null;
        operand = null;
        resetNext = true;
        updateDisplay();
    } catch (e) {
        current = 'Error';
        updateDisplay();
    }
}

// Optional: Keyboard support
window.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendDot();
    if (e.key === '+') appendOperator('+');
    if (e.key === '-') appendOperator('-');
    if (e.key === '*' || e.key === 'x') appendOperator('*');
    if (e.key === '/') appendOperator('/');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Escape') clearDisplay();
});

document.addEventListener('DOMContentLoaded', function() {
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetBtn = document.getElementById('reset-btn');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shuffleNumberPad);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetNumberPad);
    }
    // Store original order
    storeOriginalOrder();
});

// Store the original order of number buttons
let originalOrder = [];

function storeOriginalOrder() {
    const buttonsContainer = document.querySelector('.calculator-buttons');
    if (!buttonsContainer) return;
    const numberButtons = Array.from(buttonsContainer.querySelectorAll('.btn.number'));
    originalOrder = numberButtons.map(btn => ({
        text: btn.textContent.trim(),
        onclick: btn.onclick
    }));
}

function resetNumberPad() {
    const buttonsContainer = document.querySelector('.calculator-buttons');
    if (!buttonsContainer || originalOrder.length === 0) return;
    const numberButtons = Array.from(buttonsContainer.querySelectorAll('.btn.number'));
    // Restore original order
    for (let i = 0; i < numberButtons.length; i++) {
        numberButtons[i].textContent = originalOrder[i].text;
        numberButtons[i].onclick = originalOrder[i].onclick;
    }
}

function shuffleNumberPad() {
    const buttonsContainer = document.querySelector('.calculator-buttons');
    if (!buttonsContainer) return;
    // Select all number buttons (including zero and dot)
    const numberButtons = Array.from(buttonsContainer.querySelectorAll('.btn.number'));
    // Save the zero and dot button separately to preserve their classes
    const zeroBtn = numberButtons.find(btn => btn.textContent.trim() === '0');
    const dotBtn = numberButtons.find(btn => btn.textContent.trim() === '.');
    // Get only 1-9
    const oneToNine = numberButtons.filter(btn => !['0', '.'].includes(btn.textContent.trim()));
    // Shuffle 1-9
    for (let i = oneToNine.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [oneToNine[i].textContent, oneToNine[j].textContent] = [oneToNine[j].textContent, oneToNine[i].textContent];
        // Also update onclick
        [oneToNine[i].onclick, oneToNine[j].onclick] = [oneToNine[j].onclick, oneToNine[i].onclick];
    }
    // Re-append in new order: functions, operators, then shuffled numbers
    const allButtons = Array.from(buttonsContainer.children);
    // Find indexes of number buttons (1-9)
    let idx = 0;
    for (let i = 0; i < allButtons.length; i++) {
        if (allButtons[i].classList.contains('number') && !['0', '.'].includes(allButtons[i].textContent.trim())) {
            allButtons[i].textContent = oneToNine[idx].textContent;
            allButtons[i].onclick = oneToNine[idx].onclick;
            idx++;
        }
    }
} 
