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

  box-shadow: 0px 0.3px 0.3px rgba(0, 0, 0, 0.057), 0px 1.1px 0.9px rgba(0, 0, 0, 0.083),
    0px 5px 4px rgba(0, 0, 0, 0.14);
`;

export const StyledHeader = styled.div`
  font-family: 'Nunito Sans';
  font-size: 1.2em;
  font-weight: 900;

  user-select: none;

  color: var(--text-color);

  text-align: center;

  padding: 0.3em;
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
