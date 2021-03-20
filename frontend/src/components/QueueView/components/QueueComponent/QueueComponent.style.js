import styled from 'styled-components';

export const StyledQueue = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0.5em;
  border-bottom: solid 2px var(--border-color);
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

  &:disabled {
    color: var(--disabled-foreground);
    background-color: var(--background-color);
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

export const StyledList = styled.ol`
  margin: 0px;
  height: fit-content;
  overflow: hidden;
  padding-left: 1.2em;
`;

export const StyledListContainer = styled.div`
  display:flex;
`;
