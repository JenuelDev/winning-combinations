// Cryptographically secure random integer in [min, max) using rejection
// sampling to eliminate modulo bias. Entropy comes solely from the OS CSPRNG
// (crypto.getRandomValues) — there is no seed or time-based input, so results
// are not reproducible or predictable.
function secureRandomInt(min: number, max: number): number {
    const range = max - min;
    if (range <= 0) throw new Error("Invalid range");

    const randomBuffer = new Uint32Array(1);
    let randomValue: number;

    // Largest multiple of `range` that fits in the 2^32 Uint32 space. Any draw
    // at or above this is rejected so every residue class stays equally likely.
    const maxUnbiased = Math.floor(2 ** 32 / range) * range;

    do {
        crypto.getRandomValues(randomBuffer);
        randomValue = randomBuffer[0];
    } while (randomValue >= maxUnbiased);

    return min + (randomValue % range);
}

/**
 * Generate one random lottery combination.
 *
 * @param numbersPerCombination How many numbers the combination should contain (e.g. 6).
 * @param maxNumber Numbers are drawn from 1..maxNumber inclusive (e.g. 58).
 * @param include Numbers that must always appear.
 * @param exclude Numbers that must never appear.
 * @param hasAtLeastOneOfThisNumbers The combination will contain at least one of these,
 *        when a free slot and an available number allow it.
 * @returns The combination, sorted ascending.
 */
export function generateWinningCombination(
    numbersPerCombination: number,
    maxNumber: number,
    include: number[] = [],
    exclude: number[] = [],
    hasAtLeastOneOfThisNumbers: number[] = []
): number[] {
    if (include.length > numbersPerCombination) {
        throw new Error("Include array has more numbers than numbersPerCombination.");
    }

    const result = [...include];

    // Candidate pool = 1..maxNumber, minus excluded and already-included numbers.
    const pool = Array.from({ length: maxNumber }, (_, i) => i + 1)
        .filter(num => !exclude.includes(num) && !include.includes(num));

    // Repeat a complete secure shuffle when the "at least one" rule is active.
    // Rejection sampling keeps every valid combination equally likely. Selecting
    // one required number first would bias results toward combinations containing
    // several numbers from the required list.
    const alreadySatisfied = result.some(num => hasAtLeastOneOfThisNumbers.includes(num));
    const availableFromHasList = hasAtLeastOneOfThisNumbers.filter(num => pool.includes(num));
    const slotsToFill = numbersPerCombination - result.length;
    const mustSatisfyAtLeastOne =
        !alreadySatisfied && availableFromHasList.length > 0 && slotsToFill > 0;
    let shuffledPool: number[];

    do {
        shuffledPool = [...pool];
        for (let i = shuffledPool.length - 1; i > 0; i--) {
            const j = secureRandomInt(0, i + 1);
            [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
        }
    } while (
        mustSatisfyAtLeastOne &&
        !shuffledPool
            .slice(-slotsToFill)
            .some(num => availableFromHasList.includes(num))
    );

    // Fill the remaining slots from the shuffled pool.
    while (result.length < numbersPerCombination && shuffledPool.length > 0) {
        result.push(shuffledPool.pop()!);
    }

    return result.sort((a, b) => a - b);
}
