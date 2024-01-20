import chalk from "chalk";
import Coordinates from "./Coordinates";

enum CELL_STATUS {
  hidden = "hidden",
  incorrect = "incorrect",
  correct = "correct",
}

class Cell {
  location: Coordinates;
  currentValue: string;
  solution: string;
  status: CELL_STATUS;
  isHighlighted: boolean;

  static readonly CELL_STATUS = CELL_STATUS;
  static readonly DEFAULT_VALUE = "⬜";
  static readonly EMPTY_VALUE = " ";

  constructor(row: number, column: number, solution: string) {
    this.location = new Coordinates(row, column);
    this.currentValue = Cell.DEFAULT_VALUE;
    this.solution = solution;
    this.status = CELL_STATUS.hidden;
    this.isHighlighted = false;
  }

  isCorrect(): boolean {
    return this.status === CELL_STATUS.correct;
  }

  isIncorrect(): boolean {
    return this.status === CELL_STATUS.incorrect;
  }

  isHidden(): boolean {
    return this.status === CELL_STATUS.hidden;
  }

  isEmpty(): boolean {
    return this.solution === Cell.EMPTY_VALUE;
  }

  updateCurrentValue(value: string): void {
    this.currentValue = value;

    if (value === this.solution) {
      this.status = CELL_STATUS.correct;
    } else {
      this.status = CELL_STATUS.incorrect;
    }
  }

  revealSolution(): void {
    this.currentValue = this.solution;
    this.status = CELL_STATUS.correct;
  }

  highlight(): void {
    this.isHighlighted = true;
  }

  display(): void {
    var output = chalk.white(`${this.currentValue}\t`);
    if (this.status === CELL_STATUS.correct) {
      output = chalk.green.bold(`${this.solution}\t`);
    } else if (this.status === CELL_STATUS.incorrect) {
      if (this.isHighlighted) {
        output = chalk.red.bgYellow.bold(`${this.currentValue}\t`);
      } else {
        output = chalk.red.bold(`${this.currentValue}\t`);
      }
    } else if (this.status === CELL_STATUS.hidden && this.isHighlighted) {
      output = "🟨\t";
    }

    process.stdout.write(output);
    this.isHighlighted = false;
  }

  displaySolution(): void {
    process.stdout.write(this.solution + "\t");
  }
}

export default Cell;
