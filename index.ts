import Game from "./src/game/Game";
import UserInputService from "./src/services/UserInputService";

const userInputService = new UserInputService();
const game = new Game(userInputService);

game.play();
