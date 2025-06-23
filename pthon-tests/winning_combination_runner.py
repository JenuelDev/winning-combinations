import random
from typing import Tuple

def generate_sorted_combination(n: int, max_n: int) -> Tuple[int, ...]:
    return tuple(sorted(random.sample(range(1, max_n + 1), n)))

def emulate_dynamic_combinations(
    numberCountPerCombination: int = 6,
    maxNumber: int = 58,
    numberOfCombinationToGenerate: int = 1,
    randomWinningCombination: bool = False,
    withRandom: bool = False,
    numberOfRandomCombinations: int = 1
):
    count = 0
    gen_comb = generate_sorted_combination

    # Pre-generate combinations if not regenerating each time
    winning_combinations = None
    if not randomWinningCombination:
        winning_combinations = {
            gen_comb(numberCountPerCombination, maxNumber)
            for _ in range(numberOfCombinationToGenerate)
        }

    random_combinations = None
    if withRandom and not randomWinningCombination:
        random_combinations = {
            gen_comb(numberCountPerCombination, maxNumber)
            for _ in range(numberOfRandomCombinations)
        }

    while True:
        if randomWinningCombination:
            winning_combinations = {
                gen_comb(numberCountPerCombination, maxNumber)
                for _ in range(numberOfCombinationToGenerate)
            }

        if withRandom and randomWinningCombination:
            random_combinations = {
                gen_comb(numberCountPerCombination, maxNumber)
                for _ in range(numberOfRandomCombinations)
            }

        count += 1
        draw = gen_comb(numberCountPerCombination, maxNumber)

        if draw in winning_combinations or (withRandom and draw in random_combinations):
            # Print results after match
            print("---------------------------------")
            if randomWinningCombination:
                print("Random Combinations:")
            else:
                print("Combinations:")
            for comb in winning_combinations:
                print(" - ".join(map(str, comb)))
            
            if withRandom:
                print("Random Combinations:")
                for comb in random_combinations:
                    print(" - ".join(map(str, comb)))

            print("\nWinning combination:")
            print(" - ".join(map(str, draw)))
            print(f"Roll Times: {count}")
            print("WINNER WINNER CHICKEN DINNER!")
            print("---------------------------------\n")
            break


