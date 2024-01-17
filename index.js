// import readline module
const readline = require("readline");

// create interface for input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const solution = [
  ["J", "I", "P", "I", "J", "A", "P", "A", " ", "R", "E", "E", "F"],
  ["A", " ", "A", " ", "U", " ", "O", " ", "C", " ", "R", " ", "I"],
  ["N", "A", "T", "A", "L", " ", "P", "R", "O", "T", "O", "N", "S"],
  ["E", " ", "E", " ", "E", " ", "L", " ", "R", " ", "D", " ", "H"],
  [" ", "P", "L", "A", "S", "M", "A", " ", "T", "W", "E", "E", "T"],
  ["A", " ", "L", " ", " ", " ", "R", " ", "E", " ", " ", " ", "A"],
  ["C", "R", "A", "N", "E", "S", " ", "O", "X", "Y", "G", "E", "N"],
  ["Q", " ", " ", " ", "G", " ", "S", " ", " ", " ", "O", " ", "K"],
  ["U", "M", "B", "E", "R", " ", "P", "A", "V", "L", "O", "V", " "],
  ["I", " ", "L", " ", "E", " ", "I", " ", "E", " ", "D", " ", "O"],
  ["R", "O", "O", "S", "T", "E", "R", " ", "R", "O", "A", "C", "H"],
  ["E", " ", "O", " ", "S", " ", "E", " ", "N", " ", "L", " ", "M"],
  ["D", "O", "D", "O", " ", "G", "A", "Z", "E", "L", "L", "E", "S"],
];

const board = [
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
  [
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
    "⬜",
  ],
];

async function main() {
  var isDone = false;

  while (!isDone) {
    displayBoard();

    const input = await getInput("Enter your choice [r c]:");

    try {
      // Parse user input
      const choice = input.split(" ");
      const row = parseInt(choice[0]);
      const col = parseInt(choice[1]);

      if (isValidCell(row, col)) {
        if (isBlankCell(row, col)) {
          revealChainedBlankCells(row, col);
        } else if (
          isCellRevealed(row, col) &&
          !wasInvalidChoiceCell(row, col)
        ) {
          console.log("This cell has already been solved");
        } else {
          revealCell(row, col);
          displayBoard(row, col);
          const guess = await getInput("Guess the word:");
          const words = getAllConnectedWords(row, col);
          // const guesses = [];

          // words.map((word) => {
          //   const guess = guessWord(word);
          //   guesses.push(guess);
          // });

          // fillInGuess(row, col, guesses);
        }
      } else {
        console.error("Invalid input.");
      }
    } catch (e) {
      console.error(e);
    }
  }
}

async function getInput(prompt) {
  return new Promise((resolve) => {
    rl.question(`${prompt} `, (input) => {
      resolve(input);
    });
  });
}

function guessEntireWord(row, col) {
  selectAllCellsOfWord;
  // Check for vertical word

  // Check for horizontal word
}

function revealChainedBlankCells(row, col) {
  // Try in case cell is off the board
  // Check all cells directly adjacent to the cell
  if (!isCellRevealed(row, col)) {
    revealCell(row, col);
    // revealAdjacentCells(row, col);

    if (
      isValidCell(row - 1, col) &&
      isBlankCell(row, col) &&
      !isCellRevealed(row - 1, col)
    ) {
      revealChainedBlankCells(row - 1, col);
    }
    if (
      isValidCell(row, col - 1) &&
      isBlankCell(row, col) &&
      !isCellRevealed(row, col - 1)
    ) {
      revealChainedBlankCells(row, col - 1);
    }
    if (
      isValidCell(row + 1, col) &&
      isBlankCell(row, col) &&
      !isCellRevealed(row + 1, col)
    ) {
      revealChainedBlankCells(row + 1, col);
    }
    if (
      isValidCell(row, col + 1) &&
      isBlankCell(row, col) &&
      !isCellRevealed(row, col + 1)
    ) {
      revealChainedBlankCells(row, col + 1);
    }
  }
}

function revealAdjacentCells(row, col) {
  // Check all cells directly adjacent to the cell
  if (isValidCell(row - 1, col)) {
    revealCell(row - 1, col);
  }
  if (isValidCell(row, col - 1)) {
    revealCell(row, col - 1);
  }
  if (isValidCell(row + 1, col)) {
    revealCell(row + 1, col);
  }
  if (isValidCell(row, col + 1)) {
    revealCell(row, col + 1);
  }
}

function revealCell(row, col) {
  console.log(`Revealing cell: ${row} ${col}`);

  board[row][col] = solution[row][col];
}

function isValidCell(row, col) {
  console.log(
    `${row} ${col} valid? ${
      row >= 0 && row < board.length && col >= 0 && col < board[0].length
    }`
  );
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

function isBlankCell(row, col) {
  console.log(`${row} ${col} blank? ${solution[row][col] === " "}`);
  return solution[row][col] === " ";
}

function isCellRevealed(row, col) {
  console.log(`${row} ${col} revealed? ${board[row][col] !== "⬜"}`);
  return board[row][col] !== "⬜";
}

function wasInvalidChoiceCell(row, col) {
  return board[row][col].includes("❌");
}

function displayBoard() {
  board.map((row, i) => {
    row.map((col, j) => {
      const boardValue = board[i][j];
      const solutionValue = solution[i][j];
      if (boardValue === solutionValue) {
        process.stdout.write(board[i][j] + "✅" + "\t");
      } else {
        process.stdout.write(board[i][j] + "\t");
      }
      // console.log(i, j);
      if (j === row.length - 1) {
        console.log("\n\n");
      }
    });
  });
}

main();
