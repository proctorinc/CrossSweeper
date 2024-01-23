import Game from "./src/game/Game";
import UserInputService from "./src/game/UserInputService";

const userInputService = new UserInputService();
const game = new Game(userInputService);

game.play();
