from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithms.ga import run_brkga  # Import the genetic algorithm
from algorithms.box import Box
import pandas as pd
import json
from scaling import import_box_data, format_pallet_unit
from algorithms.placement import get_box_dimensions

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'csv', 'xlsx'}

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/palletize', methods=['POST'])
def palletize():
    # Initialize variables to handle both file and manual input
    boxes = None
    pallet_dims = None
    scale_ratio = None
    # Check if a file is included in the request (for file upload scenario)
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            # Get pallet dimensions from the request form
            pallet_dims_str = request.form['pallet_dims']

            # Parse pallet dimensions (they come as strings in the form data)
            pallet_dims = json.loads(pallet_dims_str)
            pallet_dims = [float(pallet_dims['length']), float(pallet_dims['width']), float(pallet_dims['height'])]  # Convert each to float

            # Testing
            print(f'!!!!!!!!!!{pallet_dims[0]}, {pallet_dims[1]}, {pallet_dims[2]}')

            # Parse the uploaded file to get the box data
            boxes, scale_ratio = import_box_data(file, pallet_dims)
        else:
            return jsonify({"error": "Invalid file format. Please upload CSV or XLSX files."}), 400
    else:
        # Handle manual input scenario
        try:
            data = request.json  # Get JSON data for manual input
            boxes = data['boxes']  # List of boxes from the request
            pallet_dims = data['pallet_dims']  # Pallet dimensions from the request
            pallet_dims = [float(pallet_dims[0]), float(pallet_dims[1]), float(pallet_dims[2])]  # Convert pallet dimensions to float

            # Testing
            print(f'!!!!!!!!!!{pallet_dims[0]}, {pallet_dims[1]}, {pallet_dims[2]}')

            scale_ratio = 1  # Set scale ratio to 1 since we're not importing from a file
        except (KeyError, ValueError):
            return jsonify({"error": "Invalid input format for manual input."}), 400

        # Convert the manually provided box data to Box objects
        box_objects = [Box(i + 1, box['length'], box['width'], box['height']) for i, box in enumerate(boxes)]

    # If boxes are still None, return an error
    if boxes is None:
        return jsonify({"error": "No boxes data provided."}), 400

    # Now proceed with the common genetic algorithm execution logic
    try:
        box_objects = [Box(i + 1, box.length, box.width, box.height) for i, box in enumerate(boxes)]
    except:
        box_objects = [Box(i + 1, box["length"], box["width"], box["height"]) for i, box in enumerate(boxes)]

    # Format the pallet dimensions using scaling ratio
    pallet_dims = (
        format_pallet_unit(pallet_dims[0], scale_ratio),
        format_pallet_unit(pallet_dims[1], scale_ratio),
        format_pallet_unit(pallet_dims[2], scale_ratio)
    )

    best_solutions = []
    # Run the genetic algorithm or placement logic
    best_solution, remaining_boxes = run_brkga(
        population_size=4,  # 4
        boxes=box_objects,
        pallet_dims=pallet_dims,
        max_generations=2,  # 2
        mutation_rate=0.07
    )
    best_solutions.append(best_solution)

    # Continue running the algorithm for remaining boxes
    while remaining_boxes:
        best_solution, remaining_boxes = run_brkga(
            population_size=4,
            boxes=remaining_boxes,
            pallet_dims=pallet_dims,
            max_generations=2,
            mutation_rate=0.07
        )
        best_solutions.append(best_solution)

    # Prepare a list of solutions, where each solution contains multiple boxes with their dimensions
    all_solutions_with_dims = []

    # Nested loop to iterate over all solutions
    for solution in best_solutions:
        pallet_solution_with_dims = []
        for box, position, orientation in solution:
            length, width, height = get_box_dimensions(box, orientation)
            pallet_solution_with_dims.append({
                "id": box.box_id,               
                "position": position,          
                "orientation": orientation,     
                "length": length,           
                "width": width,             
                "height": height            
            })
        all_solutions_with_dims.append(pallet_solution_with_dims)

    return jsonify({
        "pallet_dims": pallet_dims,
        "best_solutions": all_solutions_with_dims  # Now returning multiple pallet solutions
    })

if __name__ == '__main__':
    app.run(debug=True)