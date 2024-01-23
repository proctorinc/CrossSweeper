import { Router } from "express";
import userController from "./user/user.controller";
import gameController from "./game/game.controller";

const api = Router().use(userController).use(gameController);

export default Router().use("/api", api);
