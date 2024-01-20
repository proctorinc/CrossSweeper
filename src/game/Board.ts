import Cell from "./Cell";
import Coordinates from "./Coordinates";

class Board {
  cellMatrix: Cell[][];

  constructor(board: string[][]) {
    this.cellMatrix = this.initializeCellMatrix(board);
  }

  initializeCellMatrix(board: string[][]): Cell[][] {
    const matrix: Cell[][] = [];

    board.map((row, i) => {
      const cellRow: Cell[] = [];
      row.map((value, j) => {
        cellRow.push(new Cell(i, j, value));
      });
      matrix.push(cellRow);
    });

    return matrix;
  }

  getCell(location: Coordinates) {
    console.log(location);
    return this.cellMatrix[location.row][location.column];
  }

  isValidCellLocation(location: Coordinates): boolean {
    try {
      const result = this.getCell(location);
      console.log(result);
      return result !== undefined;
    } catch (e) {
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

    cell.revealSolution();
    if (cell.isEmpty()) {
      this.revealAdjacentCells(cell);
    }
    this.display();

    return cell;
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
        nextCellLeft.highlight();
        cells.unshift(nextCellLeft);
      }
    }

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
        nextCellRight.highlight();
        cells.push(nextCellRight);
      }
    }

    return cells.length > 1 ? cells : null;
  }

  getVerticalWordCells(cell: Cell): Cell[] | null {
    const cells: Cell[] = [cell];
    var nextCellUp: Cell | null = cell;
    var nextCellDown: Cell | null = cell;

    while (
      nextCellUp !== null &&
      nextCellUp !== undefined &&
      !nextCellUp.isEmpty()
    ) {
      nextCellUp = this.getCell(nextCellUp.location.up());

      if (
        nextCellUp !== null &&
        nextCellUp !== undefined &&
        this.isValidCellLocation(nextCellUp.location.up()) &&
        !nextCellUp.isEmpty()
      ) {
        nextCellUp.highlight();
        cells.unshift(nextCellUp);
      }
    }

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
        !nextCellDown.isEmpty()
      ) {
        nextCellDown.highlight();
        cells.push(nextCellDown);
      }
    }

    return cells.length > 1 ? cells : null;
  }

  getSolutionFromCellList(cells: Cell[]): string {
    return cells.map((cell: Cell) => cell.solution).join("");
  }

  getCurrentValueFromCellList(cells: Cell[]): string {
    return cells
      .map((cell: Cell) =>
        cell.currentValue === Cell.DEFAULT_VALUE ? "_" : cell.currentValue
      )
      .join(" ");
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
}

export default Board;
