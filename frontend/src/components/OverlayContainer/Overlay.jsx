import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
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
  }, []);

  return (
    <Rnd
      default={{
        x: 0,
        y: 50,
        width: windowWidth,
        height: windowHeight * 0.65,
      }}
      minHeight={330}
      minWidth={247}
      maxHeight={500}
      maxWidth={500}
      lockAspectRatio
    >
      <StyledOverlayContainer>
        <App format="component" />
      </StyledOverlayContainer>
    </Rnd>
  );
};

export default Overlay;
