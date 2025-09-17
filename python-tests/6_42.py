from winning_combination_runner import emulate_dynamic_combinations

# Run the simulation
for _ in range(5000):
    emulate_dynamic_combinations(
        numberCountPerCombination=6,
        maxNumber=42,
        numberOfCombinationToGenerate=0,
        randomWinningCombination=True,
        withRandom=True,
        numberOfRandomCombinations=6,
    )
