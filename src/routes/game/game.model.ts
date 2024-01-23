export type GameState = {
  gameId: string;
  board: {
    value: string;
    status: string;
    isHighlighted: boolean;
  }[][];
  step: GameStep;
  lastPickedLocation: { row: number; column: number } | null;
  totalGuesses: number;
  totalCellsClicked: number;
  score: number;
};

export type BoardStats = {
  correctLetterCells: number;
  correctEmptyCells: number;
  incorrectCells: number;
  totalCells: number;
  isBoardCompleted: boolean;
};

export enum GameStep {
  chooseCell = "choose-cell",
  guessHorizontal = "guess-horizontal",
  guessVertical = "guess-vertical",
  gameOver = "game-over",
}
