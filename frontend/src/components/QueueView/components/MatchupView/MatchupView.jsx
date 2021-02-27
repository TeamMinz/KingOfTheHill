import React, { useContext } from 'react';
import QueueContext from '../../../../util/QueueContext';
import { StyledMatchup, StyledChampion, StyledChallenger } from './MatchupView.style';

/**
 * Component to display current matchup/champion
 *
 * @returns {string} html markup for view
 */
const MatchupView = () => {
  const ctx = useContext(QueueContext);

  return (
    <StyledMatchup>
      <StyledChampion>
        {!ctx.currentChampion && '👑 No Champion Yet!'}
        {ctx.currentChampion
          && `👑: (${ctx.currentChampion.winStreak})
          ${ctx.currentChampion.user.displayName}`}
      </StyledChampion>
      <StyledChallenger>
        {ctx.currentMatchup && `⚔️: ${ctx.currentMatchup.challenger.displayName}`}
      </StyledChallenger>
    </StyledMatchup>
  );
};

export default MatchupView;
