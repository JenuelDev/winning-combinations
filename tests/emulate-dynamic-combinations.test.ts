import { generateWinningCombination } from '../src/util/winning-combination';

export function emulateDynamicCombinations() {
    const numberOfCombinations = 6;
    const maxNumber = 58;

    let winningCombination: number[] = [];
    let lotteryRoleCombination: number[] = [];
    let count = 0;

    while (true) {
        count++;
        console.log(count);

        winningCombination = generateWinningCombination(numberOfCombinations, maxNumber);
        lotteryRoleCombination = generateWinningCombination(numberOfCombinations, maxNumber);

        winningCombination.sort((a, b) => a - b);
        console.log(winningCombination.join(" - "));
        lotteryRoleCombination.sort((a, b) => a - b);
        console.log(lotteryRoleCombination.join(" - "));

        if (winningCombination.toString() === lotteryRoleCombination.toString()) {
            console.log("WINNER WINNER CHICKEN DINNER!");
            break;
        }
    }
}