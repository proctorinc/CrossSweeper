import Game from "../../game/Game";

const games = {};

const PUZZLE = [
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

export function setupNewGame(): Game {
  const game = Game.createFromSolution(PUZZLE);

  games[game.id] = game;

  return game;
}

export function loadGame(gameId: string): Game {
  return games[gameId];
}
