import React, { useState } from 'react';
import { InputNumber } from 'antd';

const BoxForm = ({ onPalletize }) => {
  const [boxes, setBoxes] = useState([{ length: 0, width: 0, height: 0 }]);
  const [palletDims, setPalletDims] = useState([10, 10, 10]);

  const handleBoxChange = (index, field, value) => {
    const newBoxes = [...boxes];
    newBoxes[index][field] = parseFloat(value);  // Ensure a valid number or default to 0
    setBoxes(newBoxes);
  };

  const addBox = () => {
    setBoxes([...boxes, { length: 0, width: 0, height: 0 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPalletize(boxes, palletDims);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Box Dimensions</h2>
      {boxes.map((box, index) => (
        <div key={index}>
          <label>Box {index + 1}:</label>
          <br></br>
          <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
            <InputNumber
              placeholder="Length"
              value={box.length}
              min={1} 
              max={30}
              onChange={(value) => handleBoxChange(index, 'length', value)}
              style={{
                width: '11em',
                height: '2.7em',
                borderRadius: '8px',
                textAlign: 'center', // Optionally centers the text horizontally
                lineHeight: '2.7em', // Matches the height for vertical centering
              }}
            />
            <InputNumber
              placeholder="Width"
              value={box.width}
              min={1} 
              max={30}
              onChange={(value) => handleBoxChange(index, 'width', value)}
              style={{
                width: '11em',
                height: '2.7em',
                borderRadius: '8px',
                textAlign: 'center', // Optionally centers the text horizontally
                lineHeight: '2.7em', // Matches the height for vertical centering
              }}
            />
            <InputNumber
              placeholder="Height"
              value={box.height}
              min={1} 
              max={30}
              onChange={(value) => handleBoxChange(index, 'height', value)}
              style={{
                width: '11em',
                height: '2.7em',
                borderRadius: '8px',
                textAlign: 'center', // Optionally centers the text horizontally
                lineHeight: '2.7em', // Matches the height for vertical centering
              }}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addBox}>Add Another Box</button>

      <h2>Pallet Dimensions</h2>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        <InputNumber
          placeholder="Length"
          value={palletDims[0]}
          min={1} 
          max={100}
          onChange={(e) => setPalletDims([parseFloat(e.target.value), palletDims[1], palletDims[2]])}
          style={{
            width: '11em',
            height: '2.7em',
            borderRadius: '8px',
            textAlign: 'center', // Optionally centers the text horizontally
            lineHeight: '2.7em', // Matches the height for vertical centering
          }}
        />
        <InputNumber
          placeholder="Width"
          value={palletDims[1]}
          min={1} 
          max={100}
          onChange={(e) => setPalletDims([palletDims[0], parseFloat(e.target.value) || 0, palletDims[2]])}
          style={{
            width: '11em',
            height: '2.7em',
            borderRadius: '8px',
            textAlign: 'center', // Optionally centers the text horizontally
            lineHeight: '2.7em', // Matches the height for vertical centering
          }}
        />
        <InputNumber
          placeholder="Height"
          value={palletDims[2]}
          min={1} 
          max={100}
          onChange={(e) => setPalletDims([palletDims[0], palletDims[1], parseFloat(e.target.value) || 0])}
          style={{
            width: '11em',
            height: '2.7em',
            borderRadius: '8px',
            textAlign: 'center', // Optionally centers the text horizontally
            lineHeight: '2.7em', // Matches the height for vertical centering
          }}
        />
      </div>
      <br></br>
      <button type="submit">Run Palletization</button>
    </form>
  );
};

export default BoxForm;