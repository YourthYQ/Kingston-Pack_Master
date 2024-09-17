import React from 'react';
import { Flex, InputNumber } from 'antd';

const InputNum = ({ box, index, handleBoxChange }) => (
  <Flex gap={12} style={{ marginBottom: '1em' }}>
    <InputNumber
      placeholder="Length"
      value={box.length}
      onChange={(value) => handleBoxChange(index, 'length', value)}
      style={{
        width: 200,
      }}
    />
    <InputNumber
      placeholder="Width"
      value={box.width}
      onChange={(value) => handleBoxChange(index, 'width', value)}
      style={{
        width: 200,
      }}
    />
    <InputNumber
      placeholder="Height"
      value={box.height}
      onChange={(value) => handleBoxChange(index, 'height', value)}
      style={{
        width: 200,
      }}
    />
  </Flex>
);

export default InputNum;