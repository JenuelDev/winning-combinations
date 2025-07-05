export function generateWinningCombination(
    numberOfCombinations: number,
    maxNumber: number,
    include: number[] = [],
    exclude: number[] = [],
    hasAtLeastOneOfThisNumbers: number[] = []
): number[] {
    const result = [...include];

    // Validate input
    if (include.length > numberOfCombinations) {
        throw new Error("Include array has more numbers than numberOfCombinations.");
    }

    // Build the pool excluding 'exclude' and 'include' values
    let pool = Array.from({ length: maxNumber }, (_, i) => i + 1)
        .filter(num => !exclude.includes(num) && !include.includes(num));

    // Shuffle pool using Fisher–Yates
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Ensure at least one number from 'hasAtLeastOneOfThisNumbers' is included
    const availableFromHasList = hasAtLeastOneOfThisNumbers
        .filter(num => !exclude.includes(num) && !include.includes(num) && pool.includes(num));

    const alreadyIncluded = result.some(num => hasAtLeastOneOfThisNumbers.includes(num));
    if (!alreadyIncluded && availableFromHasList.length > 0) {
        const chosen = availableFromHasList[Math.floor(Math.random() * availableFromHasList.length)];
        result.push(chosen);
        // Remove chosen from pool
        pool = pool.filter(num => num !== chosen);
    }

    // Add random numbers until reaching numberOfCombinations
    while (result.length < numberOfCombinations && pool.length > 0) {
        result.push(pool.pop()!);
    }

    return result.sort((a, b) => a - b);
}