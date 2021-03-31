import styled from 'styled-components';

export const StyledQueue = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const StyledQueueComponent = styled.div`
  display: flex;
  flex-direction: column;
  flex-flow: column;
  flex: 1;
`;

export const StyledJoin = styled.div`
  display: inline-block;
  text-align: center;
  padding: 0.5em;
`;

export const StyledQueueButton = styled.button`
  font-size: 1em;
  padding: 0.3em 0.6em;
  background-color: var(--border-color);
  border: none;
  outline: none;
  color: var(--text-color);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  font-family: Raleway;

  opacity: 0.8;
  box-shadow: var(--secondary-border-color) 0rem 0rem 0px;

  transition: 0.2s all;

  &:active {
    transform: translateY(0rem) !important;
    box-shadow: var(--secondary-border-color) 0rem 0rem 0px !important;
  }

  &:hover {
    transform: translateY(-0.2rem);
    box-shadow: var(--secondary-border-color) 0.0rem 0.2rem 0px;
    opacity: 1;
  }

  &:disabled {
    color: var(--disabled-foreground);
    background-color: var(--disabled-background);
    cursor: not-allowed;
    transform: translateY(0rem) !important;
    box-shadow: black 0rem 0rem 0px !important;
    opacity: 0.8 !important;
  }
`;

export const KickButton = styled.button`
  margin-left: auto;
  font-size: 0.5em;
  background-color: var(--disabled-background);
  border: none;
  outline: none;
  color: var(--text-color);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  font-family: Raleway;

  opacity: 0.8;
  box-shadow: black 0rem 0rem 0px;

  transition: 0.2s all;

  &:active {
    transform: translateY(0rem) !important;
    box-shadow: black 0rem 0rem 0px !important;
  }

  &:hover {
    transform: translateY(-0.2rem);
    box-shadow: black 0.0rem 0.2rem 0px;
    opacity: 1;
  }
`;

export const StyledSoftEdges = styled.div`
  position:absolute;
  top: 0;
  left: 2px;
  width: calc(100% - 2px);
  height: 100%;

  box-shadow: inset 0px 4px 4px 4px black;
`;

export const StyledListContainer = styled.div`
  position: relative;
  margin-top: 1em;
  margin-left: 4px;
  margin-right: 4px;
`;

export const StyledList = styled.div`
  position: relative;
  height: 30vh;
  overflow-y: auto;
  overflow-x: hidden;
  color: var(--primary-text-color);
  -ms-overflow-style: none;  
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HighlightedUserEntry = styled.div`
  position: sticky;
  top: 0;
  bottom: 0;
  font-family: 'Roboto';
  display: flex;
  flex-direction: row;
  padding: 0.1em 1.5em;
  margin-bottom: 2px;
  font-weight: 400;
  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const StyledUserEntry = styled.div`
  font-family: 'Roboto';
  display: flex;
  flex-direction: row;
  padding: 0.1em 1.5em;
  font-weight: 400;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
`;

export const StyledUserIndex = styled.span`
  font-weight: 700;
  margin-right: 0.25em;
`;
