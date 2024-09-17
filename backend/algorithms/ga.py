import random
from .placement import decode
from .fitness import fitness

def initialize_population(population_size, num_boxes):
    """
    Initializes the population for the genetic algorithm.
    
    Parameters:
    - population_size: Number of chromosomes in the population.
    - num_boxes: Number of boxes (genes) in each chromosome.

    Returns:
    - A list of chromosomes, each chromosome is a list of random keys.
    """
    return [[random.random() for _ in range(num_boxes)] for _ in range(population_size)]

def biased_crossover(parent1, parent2, bias=0.7):
    """
    Performs biased crossover between two parents to create an offspring.
    
    Parameters:
    - parent1, parent2: The parent chromosomes to be crossed.
    - bias: The probability of choosing a gene from parent1.

    Returns:
    - offspring: A new chromosome generated from parent1 and parent2.
    """
    offspring = []
    for gene1, gene2 in zip(parent1, parent2):
        if random.random() < bias:
            offspring.append(gene1)
        else:
            offspring.append(gene2)
    return offspring

def mutate(chromosome, mutation_rate):
    """
    Applies mutation to a chromosome with a given mutation rate.
    
    Parameters:
    - chromosome: The chromosome to be mutated.
    - mutation_rate: The probability of a gene mutating.

    Returns:
    - A potentially mutated chromosome.
    """
    return [random.random() if random.random() < mutation_rate else key for key in chromosome]

def create_new_population(population, boxes, pallet_dims, mutation_rate):
    """
    Creates a new population using the genetic algorithm.
    
    Parameters:
    - population: The current population of solutions.
    - boxes: The list of boxes to be placed.
    - pallet_dims: The dimensions of the pallet.
    - mutation_rate: The mutation rate for the genetic algorithm.
    
    Returns:
    - new_population: The newly generated population.
    """
    decoded_population = [decode(keys, boxes, pallet_dims) for keys in population]
    positions, penalties = zip(*decoded_population)  # Unzip positions and penalties

    # Calculate the fitness score for each solution, considering the total_penalty
    fitness_scores = [fitness(pos, pallet_dims, penalty) for pos, penalty in zip(positions, penalties)]

    # Sort population based on fitness scores
    sorted_population = sorted(zip(population, fitness_scores), key=lambda x: x[1], reverse=True)
    ranked_population = [solution for solution, score in sorted_population]

    # Select the best solutions
    new_population = ranked_population[:len(population)//2]

    # Crossover and mutation to generate new solutions
    while len(new_population) < len(population):
        parents = random.sample(new_population[:len(population)//2], 2)
        child = biased_crossover(parents[0], parents[1])
        if random.random() < mutation_rate:
            child = mutate(child, mutation_rate)
        new_population.append(child)
    
    return new_population

def run_brkga(population_size, boxes, pallet_dims, max_generations, mutation_rate):
    """
    Runs the Biased Random-Key Genetic Algorithm (BRKGA) to find the best box arrangement.

    Parameters:
    - population_size: Number of chromosomes in the population.
    - boxes: List of box objects to be packed.
    - pallet_dims: Dimensions of the pallet.
    - max_generations: Number of generations to run the algorithm.
    - mutation_rate: The probability of mutation for each gene.

    Returns:
    - best_solution: The best box arrangement found after all generations.
    """
    population = initialize_population(population_size, len(boxes))

    for generation in range(max_generations):
        print(f"Generation {generation + 1}")
        population = create_new_population(population, boxes, pallet_dims, mutation_rate)

    # testing
    print("population created")

    # Decode the final population to find the best solution
    final_population = []
    penalties = []
    for keys in population:
        positions, penalty = decode(keys, boxes, pallet_dims)
        final_population.append(positions)
        penalties.append(penalty)

    # testing
    print("penalty calculated")

    fitness_scores = [fitness(pos, pallet_dims, penalty) for pos, penalty in zip(final_population, penalties)]
    
    # testing
    print("fitness_scores calculated")

    best_solution = final_population[fitness_scores.index(max(fitness_scores))]
    
    # testing
    print("best_solution calculated")

    # Boxes that already be placed
    placed_boxes = []
    for box, position, orientation in best_solution:
        placed_boxes.append(box)
        print("box placed")

    # Boxes need to be placed into the next pallet
    remaining_boxes = []
    for box in boxes:
        if box not in placed_boxes:
            remaining_boxes.append(box)

    return best_solution, remaining_boxes