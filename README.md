# Pack Master (3D Bin Packing Palletization App)
*Pack Master* is a web-based application designed to optimize how boxes are arranged and packed on pallets for shipping. This app uses 3D bin packing algorithms to provide efficient palletization solutions while visualizing the arrangement in a user-friendly interface. Developed using React for the front-end, Flask for the back-end, and integrated with Plotly.js for 3D visualization, this app ensures that boxes are packed optimally based on dimensions, scannable labels and other constraints.

## Core Features

* **Manual Input & File Upload**: Users can either manually input the dimensions of boxes or upload a CSV/Excel file containing box dimensions.
* **Transportation & Pallet Selection**: The app offers different shipping methods and pallet types, including air and sea transportation, and plastic or wooden pallets.
* **3D Visualization**: Packed pallets are visualized in 3D using Plotly.js, showing boxes in various colors, with larger/heavier boxes at the bottom.
* **Label Facing & Support Constraints**: Ensures that all box labels are facing outward and each box is fully supported underneath to prevent damage during shipping.
* **Efficient Packing Algorithms**: Implements algorithms like greedy and genetic algorithms to achieve optimal packing solutions.

## Getting Started

Prerequisites

To run the application, you need:

* Node.js and npm installed on your machine.
* Python 3.x installed with the Flask library.

Clone the repository:
