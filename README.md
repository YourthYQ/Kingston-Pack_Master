# Pack Master (3D Bin Packing Palletization App)
*Pack Master* is a web-based application designed to optimize how boxes are arranged and packed on pallets for shipping. This app uses 3D bin packing algorithms to provide efficient palletization solutions while visualizing the arrangement in a user-friendly interface. Developed using React for the front-end, Flask for the back-end, and integrated with Plotly.js for 3D visualization, this app ensures that boxes are packed optimally based on dimensions, scannable labels and other constraints.

## Core Features

* **3D Visualization**: Uses Plotly.js to render the 3D arrangement of boxes on pallets.
* **Efficient Palletization Algorithms**: Implements greedy algorithms and biased random key genetic algorithms to ensure optimal packing.
* **Manual or File Input**: Users can either manually input box sizes or upload files (Excel or CSV) for automatic processing.
* **Flexible Shipping Options**: Supports multiple transportation methods including air and sea, with different pallet types (plastic, wooden).
* **Custom Pallet Dimensions**: Provides the ability to customize pallet sizes based on the type of material and transport method.

## Getting Started

### Prerequisites

To run the application, you need:

* Node.js and npm installed on your machine.
* Python 3.x installed with the Flask library.

Clone the repository:
```shell
git clone https://github.com/YourthYQ/Pack-Master.git
```

### Running the Application
**Front-End**:
1. Navigate to the client directory:
```shell
cd frontend
```
2. Install Vite Locally:
```shell
npm install vite --save-dev
```
3. Run the front-end development server:
```shell
npm run dev
```

**Back-End**:
1. Navigate to the server directory:
```shell
cd backend
```
2. Set up and Activate the virtual environment:
```shell
# Mac
/opt/homebrew/bin/python3 -m venv myenv
source myenv/bin/activate

# Windows
python -m virtualenv myenv
myenv\Scripts\activate
```
3. Install necessary dependencies:
```shell
conda deactivate # Optional for Mac
pip install --upgrade pip Flask flask_cors pandas numpy openpyxl scipy Werkzeug
```
4. Run the back-end development server:
```shell
flask run
```

   
