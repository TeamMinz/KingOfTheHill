import styled from 'styled-components';

export const StyledLeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
`;

export const StyledLeaderboardEntry = styled.div`
  display: flex;
  color: var(--text-color);
  margin-left: 1rem;
  margin-right: 1rem;
  align-items: center;
  text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.5);
`;

export const EntryIndex = styled.div`
  font-weight: bold;
  font-family: 'Nunito Sans';
  color: var(--text-color);
  flex: 0 0 10%;
  text-align: right;
`;

export const EntryName = styled.div`
  font-family: 'Roboto';
  color: var(--text-color);
  flex: 0 0 50%;
  margin-left: 0.25rem;
`;

export const EntryScore = styled.div`
  font-weight: bold;
  font-family: 'Nunito Sans';
  color: var(--text-color);
  flex: 0 0 auto;
  margin-left: auto;
`;
