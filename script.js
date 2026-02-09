// DOM Elements
const lengthInput = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const uppercaseCheckbox = document.getElementById('uppercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const excludeAmbiguousCheckbox = document.getElementById('exclude-ambiguous');
const generateBtn = document.getElementById('generate');
const passwordOutput = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const entropySpan = document.getElementById('entropy');
const crackTimeSpan = document.getElementById('crack-time');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toggleThemeBtn = document.getElementById('toggle-theme');

const passphraseModeCheckbox = document.getElementById('passphrase-mode');
const wordCountContainer = document.getElementById('word-count-container');
const wordCountInput = document.getElementById('word-count');
const wordCountVal = document.getElementById('word-count-val');

// Character sets
const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const ambiguousChars = 'O0l1I';

// Simple word list for passphrase
const wordList = [
  "apple","tiger","sunset","ocean","mountain","river","sky","forest",
  "laptop","keyboard","mouse","coffee","rocket","planet","echo","storm"
];

// Event listeners
lengthInput.addEventListener('input', () => lengthVal.textContent = lengthInput.value);
wordCountInput.addEventListener('input', () => wordCountVal.textContent = wordCountInput.value);
passphraseModeCheckbox.addEventListener('change', () => {
  wordCountContainer.style.display = passphraseModeCheckbox.checked ? 'block' : 'none';
});

// Generate button
generateBtn.addEventListener('click', generatePassword);

// Copy button
copyBtn.addEventListener('click', () => {
  if (!passwordOutput.value) return;
  passwordOutput.select();
  navigator.clipboard.writeText(passwordOutput.value);
  copyBtn.textContent = '✔';
  setTimeout(() => copyBtn.textContent = '📋', 1500);
});

// Toggle theme
toggleThemeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

// Functions
function generatePassword() {
  if (passphraseModeCheckbox.checked) {
    generatePassphrase();
    return;
  }

  let length = parseInt(lengthInput.value);
  let charset = lowerChars;
  let charsetSize = 26;

  if (uppercaseCheckbox.checked) { charset += upperChars; charsetSize += 26; }
  if (numbersCheckbox.checked) { charset += numberChars; charsetSize += 10; }
  if (symbolsCheckbox.checked) { charset += symbolChars; charsetSize += symbolChars.length; }
  if (excludeAmbiguousCheckbox.checked) {
    charset = charset.split('').filter(c => !ambiguousChars.includes(c)).join('');
    charsetSize = charset.length;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  passwordOutput.value = password;

  const entropy = calculateEntropy(password, charsetSize);
  entropySpan.textContent = entropy.toFixed(2);
  crackTimeSpan.textContent = estimateCrackTime(entropy);
  updateStrength(entropy);
}

function generatePassphrase() {
  const numWords = parseInt(wordCountInput.value);
  const words = [];
  for (let i = 0; i < numWords; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  const passphrase = words.join('-');
  passwordOutput.value = passphrase;

  const entropy = numWords * Math.log2(wordList.length);
  entropySpan.textContent = entropy.toFixed(2);
  crackTimeSpan.textContent = estimateCrackTime(entropy);
  updateStrength(entropy);
}

function calculateEntropy(password, charsetSize) {
  return password.length * Math.log2(charsetSize);
}

function estimateCrackTime(entropy) {
  const guessesPerSecond = 1e9;
  const seconds = Math.pow(2, entropy) / guessesPerSecond;

  if (seconds < 60) return "Seconds";
  if (seconds < 3600) return "Minutes";
  if (seconds < 86400) return "Hours";
  if (seconds < 31536000) return "Days";
  if (seconds < 3153600000) return "Years";
  if (seconds < 31536000000) return "Centuries";
  return "Millions of years";
}

function updateStrength(entropy) {
  if (entropy < 40) { strengthBar.className = 'weak'; strengthText.textContent = 'Strength: Weak'; }
  else if (entropy < 60) { strengthBar.className = 'medium'; strengthText.textContent = 'Strength: Medium'; }
  else { strengthBar.className = 'strong'; strengthText.textContent = 'Strength: Strong'; }
}

// Generate initial password on load
generatePassword();
