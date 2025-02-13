export default class Controller {
    constructor() {
        // Initialize the controller
    }

    getRandomNumber(min: number = 1, max: number = 10): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}