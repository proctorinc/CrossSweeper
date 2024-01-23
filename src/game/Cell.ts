import chalk from "chalk";
import Coordinates from "./Coordinates";

export enum CellStatus {
  hidden = "hidden",
  incorrect = "incorrect",
  correct = "correct",
}

export type JsonCell = {
  isHighlighted: boolean;
  value: string;
  solution: string;
  status: CellStatus;
};

export type JsonCellWithoutSolution = {
  isHighlighted: boolean;
  value: string;
  status: CellStatus;
};

class Cell {
  location: Coordinates;
  currentValue: string;
  solution: string;
  status: CellStatus;
  isHighlighted: boolean;

  static readonly DEFAULT_VALUE = "⬜";
  static readonly EMPTY_VALUE = " ";

  constructor(
    location: Coordinates,
    solution: string,
    currentValue: string,
    status: CellStatus,
    isHighlighted: boolean
  ) {
    this.location = location;
    this.solution = solution;
    this.currentValue = currentValue;
    this.status = status;
    this.isHighlighted = isHighlighted;
  }

  static createDefaultCell(
    row: number,
    column: number,
    solution: string
  ): Cell {
    const location = new Coordinates(row, column);
    const currentValue = Cell.DEFAULT_VALUE;
    const status = CellStatus.hidden;
    const isHighlighted = false;
    return new Cell(location, solution, currentValue, status, isHighlighted);
  }

  static createFromJson(jsonCell: JsonCell, row: number, column: number): Cell {
    const location = new Coordinates(row, column);
    const solution = jsonCell.solution;
    const currentValue = jsonCell.value;
    const status = jsonCell.status;
    const isHighlighted = jsonCell.isHighlighted;
    return new Cell(location, solution, currentValue, status, isHighlighted);
  }

  isCorrect(): boolean {
    return this.status === CellStatus.correct;
  }

  isIncorrect(): boolean {
    return this.status === CellStatus.incorrect;
  }

  isHidden(): boolean {
    return this.status === CellStatus.hidden;
  }

  isEmpty(): boolean {
    console.log("isEmpty?", this.solution === Cell.EMPTY_VALUE);
    return this.solution === Cell.EMPTY_VALUE;
  }

  updateCurrentValue(value: string): void {
    this.currentValue = value;

    if (value === this.solution) {
      this.status = CellStatus.correct;
    } else {
      this.status = CellStatus.incorrect;
    }
  }

  revealSolution(): void {
    this.currentValue = this.solution;
    this.status = CellStatus.correct;
  }

  highlight(): void {
    this.isHighlighted = true;
  }

  unhighlight(): void {
    this.isHighlighted = false;
  }

  display(): void {
    var output = chalk.white(`${this.currentValue}\t`);
    if (this.status === CellStatus.correct) {
      output = chalk.green.bold(`${this.solution}\t`);
    } else if (this.status === CellStatus.incorrect) {
      if (this.isHighlighted) {
        output = chalk.red.bgYellow.bold(`${this.currentValue}\t`);
      } else {
        output = chalk.red.bold(`${this.currentValue}\t`);
      }
    } else if (this.status === CellStatus.hidden && this.isHighlighted) {
      output = "🟨\t";
    }

    process.stdout.write(output);
  }

  displaySolution(): void {
    process.stdout.write(this.solution + "\t");
  }

  toJson(): JsonCell {
    return {
      isHighlighted: this.isHighlighted,
      solution: this.solution,
      value: this.currentValue,
      status: this.status,
    };
  }

  toJsonWithoutSolution(): JsonCellWithoutSolution {
    return {
      isHighlighted: this.isHighlighted,
      value: this.currentValue,
      status: this.status,
    };
  }
}

export default Cell;
