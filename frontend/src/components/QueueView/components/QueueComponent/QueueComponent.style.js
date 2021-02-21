import styled from 'styled-components';

export const StyledQueue = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0.5em;
  border-bottom: solid 2px var(--not-selected-color);
`;

export const StyledQueueComponent = styled.div`
  display: flex;
  flex-direction: column;
  flex-flow: column;
  flex: 1;
`;

export const StyledJoin = styled.div`
  height: 10vh;
  display: inline-block;
  text-align: center;
  padding: 0.5em;
`;

export const StyledQueueButton = styled.button`
  font-size: 1em;
  background-color: var(--not-selected-color);
  border: none;
  color: var(--text-color);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  &:disabled {
    color: var(--border-color);
  }
`;

export const KickButton = styled.button`
  float: right;
  cursor: pointer;
  border: 'none';
`;

export const StyledList = styled.ol`
  margin: 0px;
  height: fit-content;
  overflow: hidden;
  padding-left: 1.2em;
`;
