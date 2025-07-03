export function generateWinningCombination(
    numberOfCombinations: number,
    maxNumber: number,
    include: number[] = [],
    exclude: number[] = []
): number[] {
    const result = [...include];

    // Validate input
    if (include.length > numberOfCombinations) {
        throw new Error("Include array has more numbers than numberOfCombinations.");
    }

    // Build the pool excluding 'exclude' and 'include' values
    const pool = Array.from({ length: maxNumber }, (_, i) => i + 1)
        .filter(num => !exclude.includes(num) && !include.includes(num));

    // Shuffle pool using Fisher–Yates
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Add enough random numbers to reach desired combination count
    while (result.length < numberOfCombinations && pool.length > 0) {
        result.push(pool.pop()!); // "!" since pool is guaranteed to have items
    }

    return result.sort((a, b) => a - b);
}
