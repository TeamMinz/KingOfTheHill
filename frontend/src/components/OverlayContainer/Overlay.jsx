import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import Draggable from 'react-draggable';
import { StyledOverlayContainer } from './Overlay.style';
import App from '../App/App';

const Overlay = () => {
  const [windowWidth, setWidth] = useState(247);
  const [windowHeight, setHeight] = useState(600);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
  });

  return (
    <Draggable>
      <Resizable
        defaultSize={{
          width: windowWidth,
          height: windowHeight * 0.65,
        }}
        minConstraints={[247, 330]}
        maxConstraints={[300, 300]}
        lockAspectRatio
      >
        <StyledOverlayContainer>
          <App format="component" />
        </StyledOverlayContainer>
      </Resizable>
    </Draggable>
  );
};

export default Overlay;
