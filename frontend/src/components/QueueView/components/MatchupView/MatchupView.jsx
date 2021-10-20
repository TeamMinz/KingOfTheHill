import React, { useContext } from 'react';
import QueueContext from '@util/QueueContext';
import {
  StyledMatchup,
  StyledHeader,
  StyledMatchupContainer,
  MatchupCTA,
  MatchupChampion,
  MatchupChallenger,
  MatchupVersus,
} from './MatchupView.style';

/**
 * Component to display current matchup/champion
 *
 * @returns {string} html markup for view
 */
const MatchupView = () => {
  const ctx = useContext(QueueContext);

  const matchupContent = (() => {
    if (!ctx.currentChampion) {
      return (
        <StyledMatchup>
          <div>No Champion</div>
          <MatchupCTA>Come claim your crown</MatchupCTA>
        </StyledMatchup>
      );
    }
    if (ctx.currentMatchup) {
      return (
        <StyledMatchup>
          <MatchupChampion>
            👑
            {' '}
            {ctx.currentChampion.user.displayName}
            {ctx.currentChampion.winStreak ? ' | ' : ''}
            {ctx.currentChampion.winStreak ? `${ctx.currentChampion.winStreak} Wins` : ''}
            {' '}
          </MatchupChampion>
          <MatchupVersus>vs</MatchupVersus>
          <MatchupChallenger>{ctx.currentMatchup.challenger.displayName}</MatchupChallenger>
        </StyledMatchup>
      );
    }
    return (
      <StyledMatchup>
        <MatchupChampion>
          👑
          {' '}
          {ctx.currentChampion.user.displayName}
          {ctx.currentChampion.winStreak ? ' | ' : ''}
          {ctx.currentChampion.winStreak ? `${ctx.currentChampion.winStreak} Wins` : ''}
          {' '}
        </MatchupChampion>
        <MatchupCTA>Stands alone undefeated.</MatchupCTA>
      </StyledMatchup>
    );
  })();

  return (
    <StyledMatchupContainer>
      <StyledHeader>Current Matchup</StyledHeader>
      {matchupContent}
    </StyledMatchupContainer>
  );
};

export default MatchupView;
