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

  float: right;

  opacity: 0.8;
  box-shadow: black 0rem 0rem 0px;

  transition: 0.2s all;

  &:active {
    transform: translateY(0rem) !important;
    box-shadow: black 0rem 0rem 0px !important;
  }

  &:hover {
    transform: translateY(-0.2rem);
    box-shadow: black 0rem 0.2rem 0px;
    opacity: 1;
  }
`;

export const StyledSoftEdge = styled.div`
  width: 100%;
  height: 1px;
  z-index: 1000;
  box-shadow: 0px 0px 2px 2px var(--background-color);
`;

export const StyledListContainer = styled.div`
  position: relative;

  margin-top: 1em;
  margin-left: 4px;
  margin-right: 4px;

  display: flex;
  flex-direction: column;
`;

export const StyledList = styled.div`
  position: relative;
  width: 100%;
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
  bottom: 4px;
  font-family: 'Roboto';
  display: flex;
  flex-direction: row;
  padding: 0.1em 1.5em;
  margin-bottom: 2px;
  font-weight: 400;
  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  z-index: 2000;
`;

export const StyledUserEntry = styled.div`
  font-family: 'Roboto';
  display: flex;
  flex-direction: row;
  padding: 0.1em 1.5em;
  font-weight: 400;
`;

export const StyledUserIndex = styled.span`
  font-weight: 700;
  margin-right: 0.25em;
`;
