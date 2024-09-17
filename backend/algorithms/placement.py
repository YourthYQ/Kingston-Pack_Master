import numpy as np
from .box import calculate_volume

LABEL_ORIENTATIONS = [
    (0, -1, 0),  # Facing left
    (0, -1, 1),  # Rotated left, height along Y-axis
    (0, 1, 0),   # Facing right (default orientation)
    (1, 0, 0),   # Facing forward
    (0, 1, 1),   # Rotated right, height along Y-axis
    (1, 0, 1),   # Rotated forward, height along X-axis
    (-1, 0, 0),  # Facing back
    (-1, 0, 1)   # Rotated back, height along X-axis
]

def decode(keys, boxes, pallet_dims):
    ordered_boxes = sorted(zip(keys, boxes), key=lambda x: calculate_volume(x[1]), reverse=True)
    positions = []
    total_penalty = 0

    pallet_matrix = np.zeros(pallet_dims)

    for _, box in ordered_boxes:
        placed = False
        best_orientation = None
        best_score = -float('inf')  # Initialize best score to a very low value
        best_position = None

        # Use a heuristic to select potential positions (e.g., corners, edges, etc.)
        potential_positions = find_potential_positions(pallet_matrix, box, pallet_dims)

        for orientation in LABEL_ORIENTATIONS:
            length, width, height = get_box_dimensions(box, orientation)

            # Instead of looping over every possible position, only check potential ones
            for position in potential_positions:
                x, y, z = position

                if (check_valid_placement_matrix(pallet_matrix, position, length, width, height) and 
                    has_adequate_support_matrix(pallet_matrix, position, length, width, height) and
                    is_within_pallet_bounds(position, pallet_dims, length, width, height) and
                    is_label_visible_and_facing_out(box, position, orientation, positions, pallet_matrix, pallet_dims, length, width, height)):

                    # Evaluate space utilization score for this orientation
                    space_score = calculate_orientation_space_score(box, position, length, width, height, pallet_matrix, pallet_dims)

                    # Update best score and orientation
                    if space_score > best_score:
                        best_score = space_score
                        best_orientation = orientation
                        best_position = position

        # Place the box using the best orientation found
        if best_orientation is not None:
            length, width, height = get_box_dimensions(box, best_orientation)
            place_box_in_matrix(pallet_matrix, best_position, length, width, height)

            # After placing, check if this new box blocks any previously placed boxes
            if not does_box_block_others(box, best_position, best_orientation, positions):
                positions.append((box, best_position, best_orientation))
                placed = True
            else:
                # If the box blocks others, remove it
                remove_box_in_matrix(pallet_matrix, best_position, length, width, height)
    
        if not placed:
            total_penalty += 1000

    return positions, total_penalty

def find_potential_positions(pallet_matrix, box, pallet_dims):
    """
    Heuristic to find good positions for placing the next box.
    Tries to find available positions near the pallet boundaries and other placed boxes.
    """
    potential_positions = []
    shortest_side = min(box.length, box.width, box.height)  # Use the longest side

    # Define the boundaries where placement is allowed (ensure the longest side can fit)
    x_limit = pallet_dims[0] - shortest_side
    y_limit = pallet_dims[1] - shortest_side
    z_limit = pallet_dims[2] - shortest_side

    # Example: Add positions near the boundaries (x == 0, y == 0, z == 0, etc.)
    for x in range(x_limit + 1):
        for y in range(y_limit + 1):
            for z in range(z_limit + 1):
                # Check if the potential area in the matrix is unoccupied
                if np.all(pallet_matrix[x:x + shortest_side, y:y + shortest_side, z:z + shortest_side] == 0):
                    potential_positions.append((x, y, z))

    # Heuristic: Prioritize positions near pallet boundaries or other placed boxes
    # Favoring corners or edges by calculating proximity to pallet edges

    return potential_positions

def calculate_orientation_space_score(box, position, length, width, height, pallet_matrix, pallet_dims):
    """
    Calculate the score for placing the box at a specific orientation, considering:
    1. Gap minimization between boxes (high priority).
    2. Volume utilization (3D space).
    3. Label-facing orientation to ensure it's visible.
    4. Penalties for gaps or overlap.
    5. Fitting along the pallet walls (low priority).

    Parameters:
    - box: The Box object being placed.
    - position: The (x, y, z) coordinates of the box.
    - length, width, height: Dimensions of the box in the current orientation.
    - pallet_matrix: The 3D matrix representing the current pallet state.
    - pallet_dims: Dimensions of the pallet.

    Returns:
    - score: A combined score considering space, label orientation, and layout.
    """
    x, y, z = position
    score = 0

    ### 1. **Gap Minimization** (Higher Priority)
    # Identify neighboring boxes and calculate gaps
    gap_penalty = 0
    # Check for gaps on the x-axis
    if x > 0 and np.any(pallet_matrix[x-1, y:y+width, z:z+height] == 0):
        gap_penalty += 10  # Penalty for left-side gap
    if x + length < pallet_matrix.shape[0] and np.any(pallet_matrix[x+length, y:y+width, z:z+height] == 0):
        gap_penalty += 10  # Penalty for right-side gap

    # Check for gaps on the y-axis
    if y > 0 and np.any(pallet_matrix[x:x+length, y-1, z:z+height] == 0):
        gap_penalty += 10  # Penalty for front-side gap
    if y + width < pallet_matrix.shape[1] and np.any(pallet_matrix[x:x+length, y+width, z:z+height] == 0):
        gap_penalty += 10  # Penalty for back-side gap

    # Check for gaps on the z-axis (vertical gaps)
    if z > 0 and np.any(pallet_matrix[x:x+length, y:y+width, z-1] == 0):
        gap_penalty += 10  # Penalty for bottom-side gap

    # Minimize the gaps by reducing the score with the accumulated gap penalty
    score -= gap_penalty

    ### 2. **Pallet Wall Fitting** (Lower Priority)
    # Reward for fitting against the pallet walls (left, right, front, back, top, bottom)
    if x == 0 or x + length == pallet_matrix.shape[0]:
        score += 4  # Reward for fitting along the x-axis edges
    if y == 0 or y + width == pallet_matrix.shape[1]:
        score += 4  # Reward for fitting along the y-axis edges
    if z == 0 or z + height == pallet_matrix.shape[2]:
        score += 4  # Reward for fitting along the z-axis (height) edges

    ### 3. **Volume Utilization**
    # You can add a score based on how well the box's volume fits into the available space
    volume_utilization = (length * width * height) / (pallet_dims[0] * pallet_dims[1] * pallet_dims[2])
    score += volume_utilization * 10  # Higher reward for better volume utilization

    return score
    
def remove_box_in_matrix(pallet_matrix, position, length, width, height):
    x, y, z = position
    pallet_matrix[x:x+length, y:y+width, z:z+height] = 0

def does_box_block_others(box, position, orientation, positions):
    """
    Check if the current box blocks any other box's label from being visible.

    Parameters:
    - box: The Box object for the current box being placed.
    - position: The (x, y, z) position of the current box.
    - orientation: The orientation of the current box.
    - positions: The list of already placed boxes with their positions and orientations.

    Returns:
    - bool: True if the current box blocks any other box's label, False otherwise.
    """
    for placed_box, placed_pos, placed_orientation in positions:
        # Check if the current box blocks the label of the placed box
        if placed_orientation == (1, 0, 0) or placed_orientation == (1, 0, 1):
            direction = 'front'
        elif placed_orientation == (-1, 0, 0) or placed_orientation == (-1, 0, 1):
            direction = 'back'
        elif placed_orientation == (0, 1, 0) or placed_orientation == (0, 1, 1):
            direction = 'right'
        elif placed_orientation == (0, -1, 0) or placed_orientation == (0, -1, 1):
            direction = 'left'

        if (is_block_another_box(placed_box, placed_pos, placed_orientation, (box, position, orientation), direction)):
            return True

    return False

def is_block_another_box(box, position, orientation, other_box_info, direction):
    """
    Check if the box's label is blocked by another box in a given direction.

    Parameters:
    - box: The Box object whose label we are checking.
    - position: The (x, y, z) position of the box.
    - orientation: The orientation of the box.
    - other_box_info: A tuple (other_box, other_position, other_orientation) representing the other box.
    - direction: The direction in which to check if the label is blocked ('front', 'back', 'left', 'right').

    Returns:
    - bool: True if the label is blocked, False otherwise.
    """
    adjust_box = adjust_box_dimensions([box, position, orientation])

    box_x1, box_y1, box_z1 = adjust_box['x1'], adjust_box['y1'], adjust_box['z1']
    box_x2, box_y2, box_z2 = adjust_box['x2'], adjust_box['y2'], adjust_box['z2']

    other_box, other_position, other_orientation = other_box_info
    adjust_other_box = adjust_box_dimensions([other_box, other_position, other_orientation])
    other_x1, other_y1, other_z1 = adjust_other_box['x1'], adjust_other_box['y1'], adjust_other_box['z1']
    other_x2, other_y2, other_z2 = adjust_other_box['x2'], adjust_other_box['y2'], adjust_other_box['z2']

    if direction == 'front':
        if other_position[1] < position[1] and (other_x1 < box_x2 and other_x2 > box_x1):
            if other_z1 < box_z2 and other_z2 > box_z1:
                return True
    elif direction == 'back':
        if other_position[1] > position[1] and (other_x1 < box_x2 and other_x2 > box_x1):
            if other_z1 < box_z2 and other_z2 > box_z1:
                return True
    elif direction == 'right':
        if other_position[0] > position[0] and (other_y1 < box_y2 and other_y2 > box_y1):
            if other_z1 < box_z2 and other_z2 > box_z1:
                return True
    elif direction == 'left':
        if other_position[0] < position[0] and (other_y1 < box_y2 and other_y2 > box_y1):
            if other_z1 < box_z2 and other_z2 > box_z1:
                return True

    return False

def get_box_dimensions(box, orientation):
    if orientation == (0, 1, 0) or orientation == (0, -1, 0):
        return box.length, box.width, box.height
    elif orientation == (1, 0, 0) or orientation == (-1, 0, 0):
        return box.width, box.length, box.height
    elif orientation == (0, 1, 1) or orientation == (0, -1, 1):
        return box.length, box.height, box.width
    elif orientation == (1, 0, 1) or orientation == (-1, 0, 1):
        return box.height, box.length, box.width

def check_valid_placement_matrix(pallet_matrix, position, length, width, height):
    x, y, z = position

    if np.all(pallet_matrix[x:x+length, y:y+width, z:z+height] == 0):
        return True

    return False

def is_within_pallet_bounds(position, pallet_dims, length, width, height):
    """
    Checks if a box fits within the pallet bounds in a given position and orientation.
    
    Returns:
    - bool: True if the box fits within the bounds, False otherwise.
    """

    x, y, z = position
    # Ensure that the box's boundaries fit within the pallet dimensions
    return (x + length <= pallet_dims[0] and 
            y + width <= pallet_dims[1] and 
            z + height <= pallet_dims[2] and
            x >= 0 and
            y >= 0 and
            z >= 0)

def has_adequate_support_matrix(pallet_matrix, position, length, width, height):
    x, y, z = position

    if z == 0:
        return True
    
    support_area = pallet_matrix[x:x+length, y:y+width, z-1]
    return np.all(support_area == 1)

def place_box_in_matrix(pallet_matrix, position, length, width, height):
    x, y, z = position
    pallet_matrix[x:x+length, y:y+width, z:z+height] = 1

def is_label_visible_and_facing_out(box, position, orientation, positions, pallet_matrix, pallet_dims, length, width, height):
    x, y, z = position

    # Check if the label is visible on the front or back side (along y-axis)
    if orientation == (1, 0, 0) or orientation == (1, 0, 1): # Label is on the front side
        visible_from_front = y == 0 or (
            not is_blocked_by_another_box(box, position, orientation, positions, 'front') 
            and np.all(pallet_matrix[x:x+length, y, z:z+height] == 0)
        )
        return visible_from_front
    
    elif orientation == (-1, 0, 0) or orientation == (-1, 0, 1): # Label is on the back side
        visible_from_back = y + width == pallet_dims[1] or (
            not is_blocked_by_another_box(box, position, orientation, positions, 'back') 
            and np.all(pallet_matrix[x:x+length, y+width-1, z:z+height] == 0)
        )
        return visible_from_back

    # Check if the label is visible on the left or right side (along x-axis)
    elif orientation == (0, -1, 0) or orientation == (0, -1, 1): # Label is on the left side
        visible_from_left = x == 0 or (
            not is_blocked_by_another_box(box, position, orientation, positions, 'left') 
            and np.all(pallet_matrix[x, y:y+width, z:z+height] == 0)
        )
        return visible_from_left
    
    elif orientation == (0, 1, 0) or orientation == (0, 1, 1): # Label is on the right side
        visible_from_right = x + length == pallet_dims[0] or (
            not is_blocked_by_another_box(box, position, orientation, positions, 'right') 
            and np.all(pallet_matrix[x+length-1, y:y+width, z:z+height] == 0)
        )
        return visible_from_right

    return False

def is_blocked_by_another_box(box, position, orientation, positions, direction):
    adjust_box = adjust_box_dimensions([box, position, orientation])

    box_x1, box_y1, box_z1 = adjust_box['x1'], adjust_box['y1'], adjust_box['z1']
    box_x2, box_y2, box_z2 = adjust_box['x2'], adjust_box['y2'], adjust_box['z2']

    for placed_box, placed_pos, placed_orientation in positions:
        adjust_placed_box = adjust_box_dimensions([placed_box, placed_pos, placed_orientation])
        placed_x1, placed_y1, placed_z1 = adjust_placed_box['x1'], adjust_placed_box['y1'], adjust_placed_box['z1']
        placed_x2, placed_y2, placed_z2 = adjust_placed_box['x2'], adjust_placed_box['y2'], adjust_placed_box['z2']

        if direction == 'front':
            # Check if the placed box is in front of the current box
            if placed_pos[1] < position[1] and (placed_x1 < box_x2 and placed_x2 > box_x1):
                # Check if the boxes overlap in the z-axis
                if placed_z1 < box_z2 and placed_z2 > box_z1:
                    return True
        elif direction == 'back':
            # Check if the placed box is behind the current box
            if placed_pos[1] > position[1] and (placed_x1 < box_x2 and placed_x2 > box_x1):
                # Check if the boxes overlap in the z-axis
                if placed_z1 < box_z2 and placed_z2 > box_z1:
                    return True
        elif direction == 'right':
            # Check if the placed box is to the right of the current box
            if placed_pos[0] > position[0] and (placed_y1 < box_y2 and placed_y2 > box_y1):
                # Check if the boxes overlap in the z-axis
                if placed_z1 < box_z2 and placed_z2 > box_z1:
                    return True
        elif direction == 'left':
            # Check if the placed box is to the left of the current box
            if placed_pos[0] < position[0] and (placed_y1 < box_y2 and placed_y2 > box_y1):
                # Check if the boxes overlap in the z-axis
                if placed_z1 < box_z2 and placed_z2 > box_z1:
                    return True

    return False

def adjust_box_dimensions(box):
    b, pos, orient = box

    # Determine the dimensions based on orientation
    # Base (Length x Width)
    if orient == (0, 1, 0) or orient == (0, -1, 0):  # facing right OR facing left (rotated on Y axis)
        l, w, h = b.length, b.width, b.height
    elif orient == (1, 0, 0) or orient == (-1, 0, 0):  # facing forward OR facing back (rotated on X axis)
        l, w, h = b.width, b.length, b.height
    # Base (Length x Height)
    elif orient == (0, 1, 1) or orient == (0, -1, 1):  # facing right OR facing left (rotated on Y axis)
        l, w, h = b.length, b.height, b.width
    elif orient == (1, 0, 1) or orient == (-1, 0, 1):  # facing forward OR facing back (rotated on X axis)
        l, w, h = b.height, b.length, b.width

    return {
        'x1': pos[0],
        'y1': pos[1],
        'z1': pos[2],
        'x2': pos[0] + l,
        'y2': pos[1] + w,
        'z2': pos[2] + h
    }