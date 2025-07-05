from winning_combination_runner import emulate_dynamic_combinations

# Run the simulation
for _ in range(50000):
    emulate_dynamic_combinations(
        numberCountPerCombination=6,
        maxNumber=42,
        numberOfCombinationToGenerate=6,
        randomWinningCombination=False,
        withRandom=True,
        numberOfRandomCombinations=12,
        runs=10,
        printOnlyIfWon=True
    )