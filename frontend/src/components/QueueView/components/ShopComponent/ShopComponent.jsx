import React, { useContext } from 'react';
import QueueContext from '@util/QueueContext';
import styled from 'styled-components';

const StyledOverlayContainer = styled.div(
  (props) => `
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  width: 100vw;
  height: 100vh;

  pointer-events: none;

  display: ${props.shopOpen ? 'block' : 'block'};

  background-color: var(--secondary-background-color);
  z-index: 9999;

  clip-path: circle(0% at ${props.buttonX}px ${props.buttonY}px);
  transition: clip-path 1s;
  ${props.shopOpen && `clip-path: circle(120vh at ${props.buttonX}px ${props.buttonY}px);`}
`,
);

const ShopComponent = () => {
  const ctx = useContext(QueueContext);

  return (
    <StyledOverlayContainer
      shopOpen={ctx.shopState.open}
      buttonX={ctx.shopState.buttonX}
      buttonY={ctx.shopState.buttonY}
    />
  );
};

export default ShopComponent;
