import { generateWinningCombination } from '../src/util/winning-combination';
import { describe, expect, it, vi } from 'vitest';

describe('generateWinningCombination', () => {
    it('uses the browser cryptographic random number generator', () => {
        const getRandomValues = vi.spyOn(globalThis.crypto, 'getRandomValues');

        generateWinningCombination(6, 58);

        expect(getRandomValues).toHaveBeenCalled();
        getRandomValues.mockRestore();
    });

    it('returns unique, sorted numbers within the selected lottery range', () => {
        for (let draw = 0; draw < 100; draw++) {
            const combination = generateWinningCombination(6, 58);

            expect(combination).toHaveLength(6);
            expect(new Set(combination)).toHaveProperty('size', 6);
            expect(combination).toEqual([...combination].sort((a, b) => a - b));
            expect(combination.every((number) => number >= 1 && number <= 58)).toBe(true);
        }
    });

    it('honors included, excluded, and at-least-one filters', () => {
        for (let draw = 0; draw < 100; draw++) {
            const combination = generateWinningCombination(
                6,
                58,
                [3, 11],
                [5, 6, 7],
                [40, 41]
            );

            expect(combination).toEqual(expect.arrayContaining([3, 11]));
            expect(combination.some((number) => [5, 6, 7].includes(number))).toBe(false);
            expect(combination.some((number) => [40, 41].includes(number))).toBe(true);
        }
    });
});

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
