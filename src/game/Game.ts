import Board from "./Board";
import Coordinates from "./Coordinates";
import UserInputService from "../services/UserInputService";

const SOLUTION = [
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

class Game {
  userInputService: UserInputService;
  board: Board;
  isGameOver: boolean;

  constructor(userInputService: UserInputService) {
    this.userInputService = userInputService;
    this.board = new Board(SOLUTION);
    this.isGameOver = false;
  }

  async play() {
    console.log("Welcome to Cross-Sweeper!");

    while (!this.isGameOver) {
      this.board.display();
      const location = await this.promptUserForLocationUntilValid();
      const cell = this.board.chooseCell(location);

      // If horizontal word exists, guess and add it to the board
      const horizontalWordCells = this.board.getHorizontalWordCells(cell);

      // If vertical word exists, guess and add it to the board
      const verticalWordCells = this.board.getVerticalWordCells(cell);

      this.board.display();

      if (horizontalWordCells) {
        const horizontalCurrentValue =
          this.board.getCurrentValueFromCellList(horizontalWordCells);
        const horizontalSolution =
          this.board.getSolutionFromCellList(horizontalWordCells);

        console.log(`\n\nGuess the horizontal word: ${horizontalCurrentValue}`);
        console.log(`(Hint: solution = ${horizontalSolution})`);
        const guess = await this.userInputService.getUserHorizontalGuess();

        this.board.updateCellsWithGuess(guess, horizontalWordCells);
        this.board.display();
      }

      if (verticalWordCells) {
        const verticalCurrentValue =
          this.board.getCurrentValueFromCellList(verticalWordCells);
        const verticalSolution =
          this.board.getSolutionFromCellList(verticalWordCells);

        console.log(`\n\nGuess the vertical word: ${verticalCurrentValue}`);
        console.log(`(Hint: solution = ${verticalSolution})`);
        const guess = await this.userInputService.getUserHorizontalGuess();

        this.board.updateCellsWithGuess(guess, verticalWordCells);
        this.board.display();
      }

      // Whether correct or not, if guess exists add the guesses to the board
      // The board will render whether its correct or not
      // At the end of the game loop, run a board validation to check for completion
    }

    console.log("Game Over. Thanks for playing!");
  }

  async promptUserForLocationUntilValid() {
    var location = new Coordinates(-1, -1);

    // Run until user enters a valid choice
    while (!this.board.isValidCellLocation(location)) {
      // Prompt for choice
      location = await this.userInputService.getLocationChoiceFromUser();

      if (!this.board.isValidCellLocation(location)) {
        console.log("Invalid choice. Try again");
      }
    }

    return location;
  }
}

export default Game;
