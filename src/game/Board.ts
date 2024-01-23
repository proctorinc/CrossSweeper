import { BoardStats } from "../routes/game/game.model";
import Cell, { JsonCell } from "./Cell";
import Coordinates from "./Coordinates";

class Board {
  cellMatrix: Cell[][];

  constructor(cells: Cell[][]) {
    this.cellMatrix = cells;
  }

  static createFromSolution(board: string[][]): Board {
    const cells = board.map((row, i) => {
      return row.map((value, j) => {
        return Cell.createDefaultCell(i, j, value);
      });
    });

    return new Board(cells);
  }

  static loadFromJson(
    jsonBoard: {
      value: string;
      status: string;
      isHighlighted: boolean;
    }[][]
  ) {
    const board = jsonBoard.map((row, i) => {
      return row.map((cell: JsonCell, j) => {
        return Cell.createFromJson(cell, i, j);
      });
    });
    return new Board(board);
  }

  getBoardStatistics(): BoardStats {
    let correctLetterCells = 0;
    let correctEmptyCells = 0;
    let incorrectCells = 0;
    let totalCells = 0;

    this.cellMatrix.map((row) => {
      row.map((cell) => {
        if (cell.isIncorrect()) {
          incorrectCells++;
        } else if (cell.isCorrect() && cell.isEmpty()) {
          correctEmptyCells++;
        } else if (cell.isCorrect()) {
          correctLetterCells++;
        }
      });
      totalCells++;
    });

    return {
      correctLetterCells,
      correctEmptyCells,
      incorrectCells,
      totalCells,
      isBoardCompleted: correctEmptyCells + correctLetterCells === totalCells,
    };
  }

  getCell(location: Coordinates) {
    console.log(location);
    return this.cellMatrix[location.row][location.column];
  }

  isValidCellLocation(location: Coordinates): boolean {
    console.log("is valid cell location?");
    console.log(location.row, location.column);
    try {
      console.log("testing testing 123");
      const result = this.getCell(location);
      console.log("yes?");
      console.log(result);
      console.log(result !== undefined);
      return result !== undefined;
    } catch (e) {
      console.log("No!");
      console.log(e.message);
      return false;
    }
  }

  getAdjacentCellUp(cell: Cell) {
    if (this.isValidCellLocation(cell.location.up())) {
      return this.getCell(cell.location.up());
    }
    return null;
  }

  getAdjacentCellDown(cell: Cell): Cell | null {
    if (this.isValidCellLocation(cell.location.down())) {
      return this.getCell(cell.location.down());
    }
    return null;
  }

  getAdjacentCellLeft(cell: Cell): Cell | null {
    if (this.isValidCellLocation(cell.location.left())) {
      return this.getCell(cell.location.left());
    }
    return null;
  }

  getAdjacentCellRight(cell: Cell): Cell | null {
    if (this.isValidCellLocation(cell.location.right())) {
      return this.getCell(cell.location.right());
    }
    return null;
  }

  chooseCell(location: Coordinates): Cell {
    const cell = this.getCell(location);

    if (cell.isEmpty()) {
      // this.revealAdjacentCells(cell);
      this.revealChainedEmptyCells(cell);
    }
    if (cell.isHidden()) {
      cell.revealSolution();
    }
    this.display();

    return cell;
  }

  revealChainedEmptyCells(cell: Cell) {
    // Try in case cell is off the board
    // Check all cells directly adjacent to the cell
    if (cell.isHidden()) {
      cell.revealSolution();
      // revealAdjacentCells(row, col);

      if (this.isValidCellLocation(cell.location.up())) {
        const adjacentCell = this.getCell(cell.location.up());
        if (adjacentCell.isEmpty() && adjacentCell.isHidden()) {
          this.revealChainedEmptyCells(adjacentCell);
        }
      }
      if (this.isValidCellLocation(cell.location.down())) {
        const adjacentCell = this.getCell(cell.location.down());
        if (adjacentCell.isEmpty() && adjacentCell.isHidden()) {
          this.revealChainedEmptyCells(adjacentCell);
        }
      }
      if (this.isValidCellLocation(cell.location.left())) {
        const adjacentCell = this.getCell(cell.location.left());
        if (adjacentCell.isEmpty() && adjacentCell.isHidden()) {
          this.revealChainedEmptyCells(adjacentCell);
        }
      }
      if (this.isValidCellLocation(cell.location.right())) {
        const adjacentCell = this.getCell(cell.location.right());
        if (adjacentCell.isEmpty() && adjacentCell.isHidden()) {
          this.revealChainedEmptyCells(adjacentCell);
        }
      }
      this.revealAdjacentCells(cell);
    }
  }

  getAdjacentCells(cell: Cell): Cell[] {
    const cells: Cell[] = [];
    if (this.isValidCellLocation(cell.location.up())) {
      cells.push(this.getCell(cell.location.up()));
    }
    if (this.isValidCellLocation(cell.location.down())) {
      cells.push(this.getCell(cell.location.down()));
    }
    if (this.isValidCellLocation(cell.location.left())) {
      cells.push(this.getCell(cell.location.left()));
    }
    if (this.isValidCellLocation(cell.location.right())) {
      cells.push(this.getCell(cell.location.right()));
    }

    return cells;
  }

  revealAdjacentCells(cell: Cell): void {
    this.getAdjacentCells(cell).map((adjacentCell) => {
      if (adjacentCell.isEmpty() && adjacentCell.isEmpty()) {
        console.log(adjacentCell.location);
      }
      // Cells that are incorrectly filled in should not be overwritten
      if (adjacentCell.isHidden()) {
        adjacentCell.revealSolution();
      }
    });

    // this.getAdjacentCells(cell).map((adjacentCell) => {
    //   if (adjacentCell.isEmpty()) {
    //     this.revealAdjacentCells(adjacentCell);
    //   }
    // });
  }

  getHorizontalWordCells(cell: Cell): Cell[] | null {
    const cells: Cell[] = [cell];
    var nextCellLeft: Cell | null = cell;
    var nextCellRight: Cell | null = cell;

    console.log("test1");
    while (
      nextCellLeft !== null &&
      nextCellLeft !== undefined &&
      this.isValidCellLocation(nextCellLeft.location.left()) &&
      !nextCellLeft.isEmpty()
    ) {
      console.log("Getting left cell");
      nextCellLeft = this.getCell(nextCellLeft.location.left());

      if (
        nextCellLeft !== null &&
        nextCellLeft !== undefined &&
        !nextCellLeft.isEmpty()
      ) {
        console.log("unshift1");
        cells.unshift(nextCellLeft);
      }
    }

    console.log("test2");
    console.log(nextCellRight);

    while (
      nextCellRight !== null &&
      nextCellRight !== undefined &&
      this.isValidCellLocation(nextCellRight.location.right()) &&
      !nextCellRight.isEmpty()
    ) {
      console.log("Getting right cell");
      nextCellRight = this.getCell(nextCellRight.location.right());

      if (
        nextCellRight !== null &&
        nextCellRight !== undefined &&
        !nextCellRight.isEmpty()
      ) {
        console.log("push2");
        cells.push(nextCellRight);
      }
    }

    console.log("End result", cells.length > 1 ? cells : null);
    return cells.length > 1 ? cells : null;
  }

  getVerticalWordCells(cell: Cell): Cell[] | null {
    const cells: Cell[] = [cell];
    var nextCellUp: Cell | null = cell;
    var nextCellDown: Cell | null = cell;

    console.log("next cells up");
    while (
      nextCellUp !== null &&
      nextCellUp !== undefined &&
      this.isValidCellLocation(nextCellUp.location.up()) &&
      !nextCellUp.isEmpty()
    ) {
      console.log(nextCellUp.location.up());
      nextCellUp = this.getCell(nextCellUp.location.up());

      if (
        nextCellUp !== null &&
        nextCellUp !== undefined &&
        this.isValidCellLocation(nextCellUp.location.up()) &&
        !nextCellUp.isEmpty()
      ) {
        cells.unshift(nextCellUp);
      }
    }

    console.log("next cells down");
    while (
      nextCellDown !== null &&
      nextCellDown !== undefined &&
      this.isValidCellLocation(nextCellDown.location.down()) &&
      !nextCellDown.isEmpty()
    ) {
      nextCellDown = this.getCell(nextCellDown.location.down());

      if (
        nextCellDown !== null &&
        nextCellDown !== undefined &&
        this.isValidCellLocation(nextCellDown.location.down()) &&
        !nextCellDown.isEmpty()
      ) {
        cells.push(nextCellDown);
      }
    }

    return cells.length > 1 ? cells : null;
  }

  highlightCells(cells: Cell[]): void {
    cells.map((cell) => cell.highlight());
  }

  unhighlightAllCells(): void {
    this.cellMatrix.map((row) => row.map((cell) => cell.unhighlight()));
  }

  getSolutionFromCellList(cells: Cell[]): string {
    return cells.map((cell: Cell) => cell.solution).join("");
  }

  getCurrentValueFromCellList(cells: Cell[]): (string | null)[] {
    return cells.map((cell: Cell) =>
      cell.isCorrect() ? cell.currentValue : null
    );
  }

  updateCellsWithGuess(guess: string, cells: Cell[]) {
    cells.map((cell: Cell, i) => {
      const guessedCharacter = guess.toUpperCase()[i];

      // Don't overwrite the cells that were already correct. Overwrite everything else?
      if (!cell.isCorrect()) {
        cell.updateCurrentValue(guessedCharacter);
      }
    });
    // Now that the cells are filled in, go back and update the adjacent
    // This should not overwrite the cells that were incorrectly filled in
    cells.map((cell: Cell) => {
      if (cell.isCorrect()) {
        this.revealAdjacentCells(cell);
      }
    });
  }

  displaySolution(): void {
    this.cellMatrix.map((row) => {
      row.map((cell, j) => {
        cell.displaySolution();

        // Print new line at the end of each row
        if (j === row.length - 1) {
          console.log("\n\n");
        }
      });
    });
  }

  display(): void {
    this.cellMatrix[0].map(() => process.stdout.write("#\t"));
    console.log("\n");
    this.cellMatrix[0].map((_, i) => process.stdout.write(`${i}\t`));
    console.log("\n");

    this.cellMatrix.map((row, i) => {
      process.stdout.write(`${i}\t`);
      row.map((cell, j) => {
        cell.display();

        // Print new line at the end of each row
        if (j === row.length - 1) {
          console.log("\n\n");
        }
      });
    });

    this.cellMatrix[0].map(() => process.stdout.write("#\t"));
    console.log("");
  }

  toJson() {
    return this.cellMatrix.map((row: Cell[]) => {
      return row.map((cell: Cell) => {
        return cell.toJson();
      });
    });
  }
}

export default Board;
