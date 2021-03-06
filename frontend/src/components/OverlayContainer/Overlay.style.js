/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const StyledOverlayContainer = styled.div`
  height: 100%;
  width: 100%;
  outline: white solid 2px;
`;

export const StyledButtonWrapper = styled.div`
  position: fixed;
  left: ${(props) => (props.popup ? 0 : '-126px')};
  top: 20%;
  transition: left 1s;
  transition-timing-function: ease-out;
`;

export const StyledExit = styled.div`
  position: fixed;
  top: 0;
  right: 8px;
  color: white;
  z-index: 1000000;
  :hover {
    cursor: pointer;
  }
`;

export const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 50%;
  background: grey;
  color: white;
  height: 50px;
  border-radius: 0px 5px 5px 0px;
  padding-left: 10px;
  :hover {
    cursor: pointer;
  }
  img {
    height: 50px;
    padding: 5px;
  }
`;
