import styled from 'styled-components';

export const StyledMatchupContainer = styled.div`
  font-family: 'Nunito Sans';
  width: 100%;
`;

export const StyledMatchup = styled.div`
  font-family: 'Roboto';
  font-style: normal;

  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  
  user-select: none;

  text-align: center;

  padding: 0.3em;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
`;

export const StyledHeader = styled.div`
  font-family: 'Nunito Sans';
  font-size: 1.2em;
  font-weight: 900;

  user-select: none;

  color: var(--text-color);

  text-align: center;

  padding: 0.3em;
  
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
`;

export const MatchupCTA = styled.div`
  margin-top: 0.7em;
`;

export const MatchupChampion = styled.div`
  font-weight: bold;
  
`;

export const MatchupChallenger = styled.div``;

export const MatchupVersus = styled.div`
  font-style: italic;
`;
