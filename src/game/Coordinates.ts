class Coordinates {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  up(): Coordinates {
    return new Coordinates(this.row - 1, this.column);
  }

  down(): Coordinates {
    return new Coordinates(this.row + 1, this.column);
  }

  left(): Coordinates {
    return new Coordinates(this.row, this.column - 1);
  }

  right(): Coordinates {
    return new Coordinates(this.row, this.column + 1);
  }
}

export default Coordinates;
