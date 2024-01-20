import readline from "readline";
import Coordinates from "../game/Coordinates";

class UserInputService {
  commandLineInterface: readline.Interface;

  constructor() {
    this.commandLineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async getLocationChoiceFromUser(): Promise<Coordinates> {
    // Prompt for choice
    const input = await this.getInput("Enter your choice [r,c]:");

    // Parse user input as numbers
    const parsedChoice = input.split(",");
    const row = parseInt(parsedChoice[0]);
    const col = parseInt(parsedChoice[1]);

    // Create coordinates from input
    return new Coordinates(row, col);
  }

  async getUserVerticalGuess(): Promise<string> {
    return await this.getInput("Guess the vertical word:");
  }

  async getUserHorizontalGuess(): Promise<string> {
    return await this.getInput("Guess the horizontal word:");
  }

  async getInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.commandLineInterface.question(`${prompt} `, (input) => {
        resolve(input);
      });
    });
  }
}

export default UserInputService;
