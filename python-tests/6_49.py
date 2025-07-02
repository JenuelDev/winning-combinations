from winning_combination_runner import emulate_dynamic_combinations

# Run the simulation
for _ in range(1):
    emulate_dynamic_combinations(
        numberCountPerCombination=6,
        maxNumber=49,
        numberOfCombinationToGenerate=18,
        randomWinningCombination=False,
        # withRandom=True,
        # numberOfRandomCombinations=12,
        # breakAfterLoop=5000,
        # printOnlyIfWon=True
    )