// Utility: secure random int between min (inclusive) and max (exclusive)
function secureRandomInt(min: number, max: number): number {
    const range = max - min;
    if (range <= 0) throw new Error("Invalid range");

    const randomBuffer = new Uint32Array(1);
    let randomValue: number;

    // Rejection sampling to avoid modulo bias
    const maxUnbiased = Math.floor(0xffffffff / range) * range;

    do {
        crypto.getRandomValues(randomBuffer);
        randomValue = randomBuffer[0];
    } while (randomValue >= maxUnbiased);

    return min + (randomValue % range);
}

export function generateWinningCombination(
    numberOfCombinations: number,
    maxNumber: number,
    include: number[] = [],
    exclude: number[] = [],
    hasAtLeastOneOfThisNumbers: number[] = []
): number[] {
    const result = [...include];

    if (include.length > numberOfCombinations) {
        throw new Error("Include array has more numbers than numberOfCombinations.");
    }

    let pool = Array.from({ length: maxNumber }, (_, i) => i + 1)
        .filter(num => !exclude.includes(num) && !include.includes(num));

    // Fisher–Yates shuffle with secure random
    for (let i = pool.length - 1; i > 0; i--) {
        const j = secureRandomInt(0, i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const availableFromHasList = hasAtLeastOneOfThisNumbers
        .filter(num => !exclude.includes(num) && !include.includes(num) && pool.includes(num));

    const alreadyIncluded = result.some(num => hasAtLeastOneOfThisNumbers.includes(num));
    if (!alreadyIncluded && availableFromHasList.length > 0) {
        const chosen = availableFromHasList[secureRandomInt(0, availableFromHasList.length)];
        result.push(chosen);
        pool = pool.filter(num => num !== chosen);
    }

    while (result.length < numberOfCombinations && pool.length > 0) {
        result.push(pool.pop()!);
    }

    return result.sort((a, b) => a - b);
}
