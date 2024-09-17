import React, { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";

// Create a color map similar to mcolors.CSS4_COLORS.values() in Python
const colorMap = [
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen",
];

// This function creates the cube using Plotly surfaces
const createCube = (
  xMin,
  xMax,
  yMin,
  yMax,
  zMin,
  zMax,
  labelFace,
  colorIndex
) => {
  const color = colorMap[colorIndex % colorMap.length]; // Pick a color from the color map
  const surfaces = [
    // All sides (for the lines)
    {
      type: "scatter3d",
      mode: "lines",
      x: [
        xMin,
        xMax,
        xMax,
        xMin,
        xMin,
        xMin,
        xMin,
        xMin,
        xMin,
        xMax,
        xMax,
        xMin,
        xMin,
        xMax,
        xMax,
        xMax,
        xMax,
      ],
      y: [
        yMin,
        yMin,
        yMax,
        yMax,
        yMin,
        yMin,
        yMax,
        yMax,
        yMax,
        yMax,
        yMin,
        yMin,
        yMax,
        yMax,
        yMax,
        yMin,
        yMin,
      ],
      z: [
        zMin,
        zMin,
        zMin,
        zMin,
        zMin,
        zMax,
        zMax,
        zMin,
        zMax,
        zMax,
        zMax,
        zMax,
        zMax,
        zMax,
        zMin,
        zMin,
        zMax,
      ],
      line: {
        color: "red",
        width: 4,
      },
    },
    // Bottom face
    {
      type: "surface",
      x: [
        [xMin, xMax],
        [xMin, xMax],
      ],
      y: [
        [yMin, yMin],
        [yMax, yMax],
      ],
      z: [
        [zMin, zMin],
        [zMin, zMin],
      ],
      showscale: false,
      opacity: 0.5,
      colorscale: [
        [0, color],
        [1, color],
      ],
    },
    // Top face
    {
      type: "surface",
      x: [
        [xMin, xMax],
        [xMin, xMax],
      ],
      y: [
        [yMin, yMin],
        [yMax, yMax],
      ],
      z: [
        [zMax, zMax],
        [zMax, zMax],
      ],
      showscale: false,
      opacity: 0.5,
      colorscale: [
        [0, color],
        [1, color],
      ],
    },
    // Left face (YZ plane)
    {
      type: "surface",
      x: [
        [xMin, xMin],
        [xMin, xMin],
      ],
      y: [
        [yMin, yMax],
        [yMin, yMax],
      ],
      z: [
        [zMin, zMin],
        [zMax, zMax],
      ],
      showscale: false,
      opacity: 0.5,
      colorscale: [
        [0, color],
        [1, color],
      ],
    },
    // Right face (YZ plane)
    {
      type: "surface",
      x: [
        [xMax, xMax],
        [xMax, xMax],
      ],
      y: [
        [yMin, yMax],
        [yMin, yMax],
      ],
      z: [
        [zMin, zMin],
        [zMax, zMax],
      ],
      showscale: false,
      opacity: 0.5,
      colorscale: [
        [0, color],
        [1, color],
      ],
    },
    // Front face (XZ plane)
    {
      type: "surface",
      x: [
        [xMin, xMax],
        [xMin, xMax],
      ],
      y: [
        [yMin, yMin],
        [yMin, yMin],
      ],
      z: [
        [zMin, zMin],
        [zMax, zMax],
      ],
      showscale: false,
      opacity: 0.5,
      colorscale: [
        [0, color],
        [1, color],
      ],
    },
    // Back face (XZ plane)
    {
      type: "surface",
      x: [
        [xMin, xMax],
        [xMin, xMax],
      ],
      y: [
        [yMax, yMax],
        [yMax, yMax],
      ],
      z: [
        [zMin, zMin],
        [zMax, zMax],
      ],
      showscale: false,
      opacity: 0.5,
      colorscale: [
        [0, color],
        [1, color],
      ],
    },
  ];

  // Highlight the label face based on its orientation
  if (labelFace) {
    const { face, faceColor } = labelFace;
    surfaces.push({
      type: "surface",
      x: face.x,
      y: face.y,
      z: face.z,
      showscale: false,
      opacity: 1.0,
      colorscale: [
        [0, faceColor],
        [1, faceColor],
      ], // Different color for the label face
    });

    surfaces.push({
      type: "scatter3d",
      mode: "lines",
      x: [face.x[0][0], face.x[0][1], face.x[1][1], face.x[1][0], face.x[0][0]],
      y: [face.y[0][0], face.y[0][1], face.y[1][1], face.y[1][0], face.y[0][0]],
      z: [face.z[0][0], face.z[0][1], face.z[1][1], face.z[1][0], face.z[0][0]],
      line: {
        color: "black",
        width: 4,
      },
    });
  }

  return surfaces;
};

// Get the vertices for the label face based on orientation
const getLabelFace = (xMin, xMax, yMin, yMax, zMin, zMax, orientation) => {
  const orientationStr = JSON.stringify(orientation);

  switch (orientationStr) {
    case JSON.stringify([0, 1, 0]): // Right face
    case JSON.stringify([0, 1, 1]):
      return {
        face: {
          x: [
            [xMax, xMax],
            [xMax, xMax],
          ],
          y: [
            [yMin, yMax],
            [yMin, yMax],
          ],
          z: [
            [zMin, zMin],
            [zMax, zMax],
          ],
        },
        faceColor: "yellow", // Highlighted face color
      };
    case JSON.stringify([1, 0, 0]): // Front face
    case JSON.stringify([1, 0, 1]):
      return {
        face: {
          x: [
            [xMin, xMax],
            [xMin, xMax],
          ],
          y: [
            [yMin, yMin],
            [yMin, yMin],
          ],
          z: [
            [zMin, zMin],
            [zMax, zMax],
          ],
        },
        faceColor: "yellow",
      };
    case JSON.stringify([0, -1, 0]): // Left face
    case JSON.stringify([0, -1, 1]):
      return {
        face: {
          x: [
            [xMin, xMin],
            [xMin, xMin],
          ],
          y: [
            [yMin, yMax],
            [yMin, yMax],
          ],
          z: [
            [zMin, zMin],
            [zMax, zMax],
          ],
        },
        faceColor: "yellow",
      };
    case JSON.stringify([-1, 0, 0]): // Back face
    case JSON.stringify([-1, 0, 1]):
      return {
        face: {
          x: [
            [xMin, xMax],
            [xMin, xMax],
          ],
          y: [
            [yMax, yMax],
            [yMax, yMax],
          ],
          z: [
            [zMin, zMin],
            [zMax, zMax],
          ],
        },
        faceColor: "yellow",
      };
    default:
      return null;
  }
};

const ResultsDisplay = ({ solution, palletDims }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track which pallet solution to display

  const [windowSize, setWindowSize] = useState({
    width: Math.floor(window.innerWidth * 0.83),
    height: Math.floor(window.innerHeight * 0.68)
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: Math.floor(window.innerWidth * 0.83),
        height: Math.floor(window.innerHeight * 0.68)
      });
    }
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(solution[currentIndex]);
  //console.log(palletDims)
  // Safely check for the presence of solutions
  if (!solution || !solution[currentIndex]) {
    return <div>No solutions to display</div>;
  }

  // Key press handler to switch between pallets
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % solution.length);
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + solution.length) % solution.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [solution[currentIndex].length]);

  const currentSolution = solution[currentIndex]; // Access the current pallet solution (an array of boxes)

  // Generate a color for each unique box dimension combination
  const colorMapDict = useMemo(() => {
    const colorDict = {};
    let colorIndex = 0;

    currentSolution.forEach((box) => {
      const dimensionKey = `${box.length}-${box.width}-${box.height}`;
      if (!colorDict[dimensionKey]) {
        colorDict[dimensionKey] = colorIndex;
        colorIndex += 5;
      }
    });

    return colorDict;
  }, [currentSolution]);

  // Mapping through the current pallet solution array to create cubes for each box
  const data = currentSolution
    .map((box) => {
      const [x, y, z] = box.position;
      const [l, w, h] = [box.length, box.width, box.height]; // Ensure height (h) is properly defined

      // Get color index from the colorMapDict
      const dimensionKey = `${l}-${w}-${h}`;
      const colorIndex = colorMapDict[dimensionKey];

      // Get label face based on the box orientation
      const labelFace = getLabelFace(
        x,
        x + l,
        y,
        y + w,
        z,
        z + h,
        box.orientation
      );

      // Creating a cube for each box in the solution with labelFace highlighting
      return createCube(x, x + l, y, y + w, z, z + h, labelFace, colorIndex);
    })
    .flat(); // Using flat() to ensure a single array with all cubes

  return (
    <div className="card8">
      <div className="title">
        <h2 className="ubuntu-heading">Here's your pallets.</h2>
      </div>
      <div className="plot">
        <Plot
          data={data}
          layout={{
            width: `${windowSize.width}`,
            height: `${windowSize.height}`,
            title: `Palletization Visualization (Pallet ${
              currentIndex + 1
            } of ${solution.length})`,
            scene: {
              xaxis: { title: "X", range: [0, palletDims[0]] }, // Use palletDims for axis
              yaxis: { title: "Y", range: [0, palletDims[1]] },
              zaxis: { title: "Z", range: [0, palletDims[2]] }, // Use height based on pallet dimensions
            },
          }}
        />
      </div>
    </div>
  );
};

export default ResultsDisplay;
