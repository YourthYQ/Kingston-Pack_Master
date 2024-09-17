from functools import reduce
from .box import calculate_volume

# Constants for penalties and rewards
SPACE_UTILIZATION_REWARD = 650
LABEL_FACING_REWARD = 300  # Reward for optimal label-facing orientation
GAP_PENALTY = 200  # Penalty for gaps between boxes

def fitness(solution, pallet_dims, total_penalty):
    """
    Calculate the fitness score for a given solution.

    Parameters:
    - solution: A list of (box, position, orientation) tuples representing the placement of boxes.
    - pallet_dims: The dimensions of the pallet.
    - total_penalty: The accumulated penalty for the placement.

    Returns:
    - fitness_score: The calculated fitness score for the solution.
    """
    # Calculate the total volume of the placed boxes
    total_volume = reduce(lambda total, gene: total + calculate_volume(gene[0]), solution, 0)

    # Calculate space utilization reward (volume utilization)
    space_utilization_reward = calculate_space_and_volume_utilization_reward(total_volume, pallet_dims)

    # Calculate label-facing reward
    label_facing_reward = calculate_label_facing_reward(solution, pallet_dims)

    # Calculate gap penalty or reward
    gap_penalty = calculate_gap_penalty(solution)

    # Apply penalties to reduce fitness score
    fitness_score = total_volume + space_utilization_reward + label_facing_reward - gap_penalty - total_penalty
    
    return fitness_score

def calculate_space_and_volume_utilization_reward(total_volume, pallet_dims):
    """
    Calculate the reward for efficiently utilizing the pallet's volume and space.

    Parameters:
    - total_volume: Total volume of the placed boxes.
    - pallet_dims: The dimensions of the pallet.

    Returns:
    - reward: The reward based on the volume and space utilization.
    """
    # Calculate the volume of the pallet
    pallet_volume = pallet_dims[0] * pallet_dims[1] * pallet_dims[2]

    # Calculate the utilization ratio
    utilization_ratio = total_volume / pallet_volume

    # Reward based on the utilization ratio
    reward = utilization_ratio * SPACE_UTILIZATION_REWARD
    
    return reward

def calculate_label_facing_reward(solution, pallet_dims):
    """
    Calculate the reward for optimal label-facing orientation.

    Parameters:
    - solution: A list of (box, position, orientation) tuples representing the placement of boxes.
    - pallet_dims: The dimensions of the pallet.

    Returns:
    - reward: The reward based on how many boxes have labels facing outward to the nearest side.
    """
    reward = 0

    for box, position, orientation in solution:
        # Calculate the nearest side for each box
        x, y, z = position
        distances = {
            'front': y,
            'back': pallet_dims[1] - (y + box.width),
            'left': x,
            'right': pallet_dims[0] - (x + box.length),
        }

        # Find the nearest side
        nearest_side = min(distances, key=distances.get)

        # If the box is facing the nearest side, apply the label reward
        if nearest_side == 'front' and orientation in [(1, 0, 0), (1, 0, 1)]:
            reward += LABEL_FACING_REWARD
        elif nearest_side == 'back' and orientation in [(-1, 0, 0), (-1, 0, 1)]:
            reward += LABEL_FACING_REWARD
        elif nearest_side == 'left' and orientation in [(0, -1, 0), (0, -1, 1)]:
            reward += LABEL_FACING_REWARD
        elif nearest_side == 'right' and orientation in [(0, 1, 0), (0, 1, 1)]:
            reward += LABEL_FACING_REWARD

    return reward

def calculate_gap_penalty(solution):
    """
    Calculate a penalty based on the gaps between boxes to encourage tighter packing.

    Parameters:
    - solution: A list of (box, position, orientation) tuples representing the placement of boxes.

    Returns:
    - penalty: The penalty based on the number and size of gaps between boxes.
    """
    penalty = 0

    # Compare each box with the others in the solution
    for i, (box_a, pos_a, orient_a) in enumerate(solution):
        for j, (box_b, pos_b, orient_b) in enumerate(solution):
            if i != j:
                # Compare positions and orientations to detect gaps
                if pos_a[0] < pos_b[0] and pos_a[0] + box_a.length < pos_b[0]:  # Gap on x-axis
                    penalty += GAP_PENALTY
                if pos_a[1] < pos_b[1] and pos_a[1] + box_a.width < pos_b[1]:  # Gap on y-axis
                    penalty += GAP_PENALTY
                if pos_a[2] < pos_b[2] and pos_a[2] + box_a.height < pos_b[2]:  # Gap on z-axis
                    penalty += GAP_PENALTY

    return penalty