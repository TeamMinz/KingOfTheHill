import styled from 'styled-components';

export const StyledMatchup = styled.div`
  height: fit-content;
  display: inline-block;
  text-align: left;
  padding: 0.5em;
  //padding-top: 10px;
  border-bottom: solid 2px var(--not-selected-color);
`;

export const StyledChampion = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledChallenger = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;