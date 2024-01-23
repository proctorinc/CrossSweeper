import { BoardStats, GameState, GameStep } from "../routes/game/game.model";
import Board from "./Board";
import Coordinates from "./Coordinates";
import { v4 as uuidv4 } from "uuid";

class Game {
  id: string;
  board: Board;
  isGameOver: boolean;
  step: GameStep;
  lastPickedLocation: Coordinates | null;
  totalCellsClicked: number;
  totalGuesses: number;
  score: number;

  constructor(
    id: string,
    board: Board,
    step: GameStep = GameStep.chooseCell,
    lastPickedLocation: Coordinates | null = null,
    totalCellsClicked: number = 0,
    totalGuesses: number = 0,
    score: number = 0
  ) {
    this.id = id;
    this.board = board;
    this.step = step;
    this.lastPickedLocation = lastPickedLocation;
    this.totalGuesses = totalGuesses;
    this.totalCellsClicked = totalCellsClicked;
    this.score = score;
  }

  getState(): GameState {
    const boardStats = this.board.getBoardStatistics();
    const score = this.getBoardScore(boardStats);

    return {
      gameId: this.id,
      board: this.board.toJson(),
      step: this.step,
      // step: boardStats.isBoardCompleted ? GameStep.gameOver : this.step,
      lastPickedLocation: this.lastPickedLocation
        ? this.lastPickedLocation.toJson()
        : null,
      totalGuesses: this.totalGuesses,
      totalCellsClicked: this.totalCellsClicked,
      score: score,
    };
  }

  static loadBoardState(state: GameState): Game {
    const id = state.gameId;
    const board = Board.loadFromJson(state.board);
    const step = state.step;
    const lastPickedLocation = state.lastPickedLocation
      ? Coordinates.loadFromJson(state.lastPickedLocation)
      : null;
    const totalCellsClicked = state.totalCellsClicked;
    const totalGuesses = state.totalGuesses;
    const score = state.score;

    return new Game(
      id,
      board,
      step,
      lastPickedLocation,
      totalCellsClicked,
      totalGuesses,
      score
    );
  }

  static createFromSolution(solution: string[][]): Game {
    const id = uuidv4();
    const board = Board.createFromSolution(solution);

    return new Game(id, board);
  }

  getBoardScore(boardStats: BoardStats): number {
    return (
      boardStats.correctEmptyCells * 1 +
      boardStats.correctLetterCells * 10 -
      this.totalGuesses * 3 -
      this.totalCellsClicked * 3
    );
  }

  chooseCell(row: number, column: number) {
    if (this.step === GameStep.chooseCell) {
      const location = new Coordinates(row, column);
      const cell = this.board.chooseCell(location);
      this.lastPickedLocation = location;

      // If horizontal word exists, guess and add it to the board
      const horizontalWordCells = this.board.getHorizontalWordCells(cell);

      // If vertical word exists, guess and add it to the board
      const verticalWordCells = this.board.getVerticalWordCells(cell);

      const horizontalCurrentValue = horizontalWordCells
        ? this.board.getCurrentValueFromCellList(horizontalWordCells)
        : null;

      const verticalCurrentValue = verticalWordCells
        ? this.board.getCurrentValueFromCellList(verticalWordCells)
        : null;

      if (horizontalCurrentValue) {
        this.step = GameStep.guessHorizontal;
        this.board.highlightCells(horizontalWordCells);
      } else if (verticalCurrentValue) {
        this.step = GameStep.guessVertical;
        this.board.highlightCells(verticalWordCells);
      }

      // Increate total cells clicked
      this.totalCellsClicked++;

      return {
        horizontalWord: horizontalCurrentValue,
        verticalWord: verticalCurrentValue,
      };
    } else {
      throw new Error(`Invalid game step. Current step is: ${this.step}`);
    }
  }

  skipGuess() {
    this.board.unhighlightAllCells();
    const cell = this.board.getCell(this.lastPickedLocation);
    const verticalWordCells = this.board.getVerticalWordCells(cell);

    if (this.step === GameStep.guessHorizontal && verticalWordCells) {
      // If vertical word needs to be guessed
      this.step = GameStep.guessVertical;
      this.board.highlightCells(verticalWordCells);
    } else {
      this.step = GameStep.chooseCell;
    }
  }

  guessWord(guess: string) {
    this.board.unhighlightAllCells();
    const cell = this.board.getCell(this.lastPickedLocation);
    const verticalWordCells = this.board.getVerticalWordCells(cell);

    if (this.step === GameStep.guessHorizontal) {
      // If horizontal word exists, guess and add it to the board
      const horizontalWordCells = this.board.getHorizontalWordCells(cell);

      this.board.updateCellsWithGuess(guess, horizontalWordCells);

      // Increase guess count
      this.totalGuesses++;

      // If vertical word needs to be guessed
      if (verticalWordCells) {
        this.step = GameStep.guessVertical;
        this.board.highlightCells(verticalWordCells);
      } else {
        this.step = GameStep.chooseCell;
      }
    } else if (this.step === GameStep.guessVertical) {
      this.board.updateCellsWithGuess(guess, verticalWordCells);

      // Increase guess count
      this.totalGuesses++;
      this.step = GameStep.chooseCell;
    }
  }
}

export default Game;
