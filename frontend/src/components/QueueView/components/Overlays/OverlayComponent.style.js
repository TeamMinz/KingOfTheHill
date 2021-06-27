import styled from 'styled-components';

export const StyledOverlayContainer = styled.div(
  (props) => `
  position: absolute;
  top: -1px;
  left: -1px;

  width: calc(100% + 2px);
  height: calc(100% + 2px);

  overflow: hidden;


  background-color: var(--secondary-background-color);
  
  ${
  props.animState == 'closed' || props.animState == 'closing'
    ? `clip-path: circle(0% at ${props.buttonX}px ${props.buttonY}px);`
    : ''
}
  ${props.animState == 'open' || props.animState == 'opening' ? 'z-index: 9999;' : 'z-index: 0;'}
  transition: clip-path 0.5s;
  ${props.animState == 'open' || props.animState == 'closing' ? 'transition-delay: 0.05s;' : ''}
  ${
  props.animState == 'open' || props.animState == 'opening'
    ? `clip-path: circle(120vh at ${props.buttonX}px ${props.buttonY}px);`
    : ''
}
  
}
`,
);

export const StyledOverlayInner = styled.div(
  (props) => `
  display: flex;
  flex-direction: column;


  position:relative;
  top:0;
  left: 0;

  background-color: var(--background-color);

  box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.25);

  width: 100%;
  height: 100%;

  ${
  props.animState == 'closed' || props.animState == 'closing'
    ? `clip-path: circle(0% at ${props.buttonX}px ${props.buttonY}px);`
    : ''
}
  transition: clip-path 0.5s;
  ${props.animState == 'closed' || props.animState == 'opening' ? 'transition-delay: 0.05s;' : ''}
  ${
  props.animState == 'open' || props.animState == 'opening'
    ? `clip-path: circle(120vh at ${props.buttonX}px ${props.buttonY}px);`
    : ''
}
}
`,
);

export const StyledOverlayHeader = styled.div`
  display: block;
  text-align: center;
  position: relative;
`;

export const StyledOverlayTitle = styled.span`
  font-family: 'Nunito Sans';
  font-size: 1.2em;
  font-weight: 900;

  margin-right: auto;

  user-select: none;

  color: var(--text-color);

  text-align: center;

  padding: 0.3em;

  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
`;

export const StyledCloseButton = styled.button`
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  top: 50%;
  left: 0.2em;

  width: 1.5em;
  height: 1.5em;

  border-radius: 50%;

  border: none;
  outline: none;

  transform: translateY(-50%);

  padding: 0;

  color: var(--secondary-text-color);
  background-color: var(--secondary-background-color);

  cursor: pointer;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);

  > svg {
    width: 1em;
    height: 1em;
  }

  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(calc(-50% - 0.25em));
    box-shadow: 0px calc(2px + 0.25em) 2px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(calc(0.1em - 50%)) !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
`;

export const StyledOverlayDivider = styled.div`
  background-color: var(--secondary-background-color);

  height: 1.5em;
  width: 100%;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
`;
