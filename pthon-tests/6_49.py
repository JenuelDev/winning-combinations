from winning_combination_runner import emulate_dynamic_combinations

# Run the simulation
for _ in range(100):
    emulate_dynamic_combinations(
        numberCountPerCombination=6,
        maxNumber=49,
        numberOfCombinationToGenerate=6,
        randomWinningCombination=True,
        withRandom=True,
        numberOfRandomCombinations=6
    )