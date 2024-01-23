import { NextFunction, Request, Response, Router } from "express";
import { loadGame, setupNewGame } from "./game.service";

const router = Router();

router.get("/game", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const game = await setupNewGame();
    res.json(game.getState());
  } catch (error) {
    next(error);
  }
});

router.get(
  "/game/:gameId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = loadGame(req.params.gameId);
      res.json(game.getState());
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/game/:gameId/choose-cell",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = loadGame(req.params.gameId);
      const wordsToGuess = game.chooseCell(req.body.row, req.body.column);

      res.json({
        state: game.getState(),
        guess: wordsToGuess,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/game/:gameId/guess-word",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = loadGame(req.params.gameId);
      game.guessWord(req.body.word);
      res.json({
        state: game.getState(),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/game/:gameId/skip-guess",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = loadGame(req.params.gameId);
      game.skipGuess();
      res.json({
        state: game.getState(),
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
