export function generateWinningCombination(numberOfCombinations: number, maxNumber: number) {
    const numbers: number[] = [];

    while (numbers.length < numberOfCombinations) {
        const num = Math.floor(Math.random() * maxNumber) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }

    return numbers;
}