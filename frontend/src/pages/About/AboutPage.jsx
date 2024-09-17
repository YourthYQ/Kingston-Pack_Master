import React from 'react';
import './AboutPage.css'; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <h1>About the Palletization Optimization App</h1>
      <p>
        The <strong>Palletization Optimization App</strong> is designed to streamline warehouse logistics by 
        calculating the optimal way to arrange boxes on pallets. By focusing on space utilization and efficiency, 
        this app helps minimize shipping costs and improves workflow by visualizing the most efficient box arrangement.
      </p>

      <h2>Key Features</h2>
      <ul className="features-list">
        <li>
          <strong>🔷 3D Pallet Visualization:</strong> Interactive 3D visualization using Plotly.js to view arrangements from all angles.
        </li>
        <li>
          <strong>🔷 Customizable Box & Pallet Dimensions:</strong> Input any box and pallet sizes to tailor the solution.
        </li>
        <li>
          <strong>🔷 Optimized Space Utilization:</strong> Calculates the best way to pack boxes, reducing wasted space.
        </li>
        <li>
          <strong>🔷 Highlighted Label Faces:</strong> Ensures easy identification by highlighting label-facing sides.
        </li>
      </ul>

      <h2>The Core Algorithm: Biased Random-Key Genetic Algorithm (BRKGA)</h2>
      <p>
        At the core of the app is the <strong>Biased Random-Key Genetic Algorithm (BRKGA)</strong>, an advanced 
        evolutionary algorithm designed to solve optimization problems like palletization. It simulates natural 
        evolution, refining box arrangements through mutation and crossover until the best solution is found.
      </p>
      <ul className="tech-stack-list">
        <li><strong>🔶 Population Initialization:</strong> Generates a set of random box arrangements.</li>
        <li><strong>🔶 Selection & Evolution:</strong> Improves the arrangements through iteration.</li>
        <li><strong>🔶 Decoding & Fitness Evaluation:</strong> Tests each solution for space utilization and efficiency.</li>
        <li><strong>🔶 Optimal Arrangement:</strong> The best arrangement is selected for pallet optimization.</li>
      </ul>

      <h2>Tech Stack Overview</h2>
      <p><strong>Front-End:</strong></p>
      <ul className="tech-stack-list">
        <li>⚛️ <strong>React.js:</strong> JavaScript framework for the user interface.</li>
        <li>💻 <strong>TypeScript/JavaScript:</strong> Provides strict typing for maintainability.</li>
        <li>📊 <strong>Plotly.js:</strong> Interactive 3D visualizations of palletization solutions.</li>
      </ul>

      <p><strong>Back-End:</strong></p>
      <ul className="tech-stack-list">
        <li>🐍 <strong>Flask:</strong> Python framework for the REST API.</li>
        <li>🌐 <strong>Flask-CORS:</strong> Cross-origin communication between front-end and back-end.</li>
        <li>🔧 <strong>Python:</strong> Handles backend logic and algorithm implementation.</li>
        <li>🚀 <strong>FastAPI (Optional):</strong> For faster API handling.</li>
      </ul>

      <h2>Challenges & Key Algorithm Features</h2>
      <div className="challenges-container">
        <h3>1. 3D Space Management</h3>
        <p>Handling different box sizes and orientations within the pallet space.</p>

        <h3>2. Multiple Box Orientations</h3>
        <p>The algorithm optimizes space by considering all possible box orientations.</p>

        <h3>3. Label Face Highlighting</h3>
        <p>Ensures easy access to box labels by highlighting the label face in the 3D view.</p>

        <h3>4. Stability & Support</h3>
        <p>Ensures stable stacking by placing heavier boxes at the bottom.</p>

        <h3>5. Maximizing Space Efficiency</h3>
        <p>Minimizes wasted space by optimizing box placement within the pallet’s dimensions.</p>

        <h3>6. Multi-Pallet Handling</h3>
        <p>Distributes boxes across multiple pallets when necessary.</p>

        <h3>7. Quick Solution Search</h3>
        <p>The BRKGA algorithm quickly narrows down to the best arrangement through generations.</p>

        <h3>8. Penalties for Invalid Arrangements</h3>
        <p>The algorithm penalizes invalid placements, ensuring stability and space optimization.</p>

        <h3>9. Interactive Visualization</h3>
        <p>Users can interact with the 3D view to inspect and verify the arrangement.</p>
      </div>
    </div>
  );
};

export default About;