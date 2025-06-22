import random
from typing import Tuple

def generate_sorted_combination(n: int, max_n: int) -> Tuple[int, ...]:
    return tuple(sorted(random.sample(range(1, max_n + 1), n)))

def emulate_dynamic_combinations(numberCountPerCombination: int = 6, maxNumber: int = 58, numberOfCombinationToGenerate: int = 1, randomWinningCombination: bool = False, withRandom: bool = False, numberOfRandomCombinations: int = 1):
    count = 0
    print("---------------------------------")
    print("Rolling The Numbers ....")

    # Pre-generate winning combinations
    if not randomWinningCombination:
        winning_combinations = {generate_sorted_combination(numberCountPerCombination, maxNumber) for _ in range(numberOfCombinationToGenerate)}

    while True:
        if randomWinningCombination:
            winning_combinations = {generate_sorted_combination(numberCountPerCombination, maxNumber) for _ in range(numberOfCombinationToGenerate)}

        if withRandom:
            randomCombination = {generate_sorted_combination(numberCountPerCombination, maxNumber) for _ in range(numberOfRandomCombinations)}

        count += 1
        lottery_combination = generate_sorted_combination(numberCountPerCombination, maxNumber)

        if lottery_combination in winning_combinations or (withRandom and lottery_combination in randomCombination):
            print("---------------------------------")
            print("Combinations:")
            for comb in winning_combinations:
                print(" - ".join(map(str, comb)))
            
            if withRandom:
                print("Random Combinations:")
                for comb in randomCombination:
                    print(" - ".join(map(str, comb)))

            print("\nWinning combination:")
            print(" - ".join(map(str, lottery_combination)))
            print(f"Role Times: {count}")
            print("WINNER WINNER CHICKEN DINNER!")
            print("---------------------------------\n")
            break

# Run the simulation
for _ in range(100):
    emulate_dynamic_combinations(6, 49, 6, randomWinningCombination=False, withRandom=True, numberOfRandomCombinations=6)
