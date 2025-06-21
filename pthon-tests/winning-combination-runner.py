import random

def generate_winning_combination(number_of_combinations: int, max_number: int) -> list[int]:
    numbers = []
    while len(numbers) < number_of_combinations:
        num = random.randint(1, max_number)
        if num not in numbers:
            numbers.append(num)
    return numbers

def emulate_dynamic_combinations():
    number_of_combinations = 6
    max_number = 58

    

    count = 0
    print("---------------------------------")
    print("Rolling The Numbers ....")

    while True:
        winning_combination1 = generate_winning_combination(number_of_combinations, max_number)
        winning_combination1.sort()
        

        winning_combination2 = generate_winning_combination(number_of_combinations, max_number)
        winning_combination2.sort()
        

        winning_combination3 = generate_winning_combination(number_of_combinations, max_number)
        winning_combination3.sort()
        

        winning_combination4 = generate_winning_combination(number_of_combinations, max_number)
        winning_combination4.sort()

        count += 1
        
        lottery_role_combination = generate_winning_combination(number_of_combinations, max_number)
        
        lottery_role_combination.sort()
        

        if winning_combination1 == lottery_role_combination or winning_combination2 == lottery_role_combination or winning_combination3 == lottery_role_combination or winning_combination4 == lottery_role_combination:
            print("Combinations:")
            print(" - ".join(str(num) for num in winning_combination1))
            print(" - ".join(str(num) for num in winning_combination2))
            print(" - ".join(str(num) for num in winning_combination3))
            print(" - ".join(str(num) for num in winning_combination4))
            print()
            print("Winning combination:")
            print(" - ".join(str(num) for num in lottery_role_combination))
            print(f"Role Times: {count}")
            print("WINNER WINNER CHICKEN DINNER!")
            print("---------------------------------")
            print()
            print()
            break

# Run the simulation
count = 0
maxCombination = 100
while True:
    count += 1
    emulate_dynamic_combinations()

    if count == maxCombination:
        break
    
