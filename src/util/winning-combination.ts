export function generateWinningCombination(numberOfCombinations: number, maxNumber: number): number[] {
    const pool = Array.from({ length: maxNumber }, (_, i) => i + 1);

    // Fisher–Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, numberOfCombinations).sort((a, b) => a - b);
}