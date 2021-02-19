import React, {useContext} from 'react';
import '../../../App/App.scss';
import './MatchupView.scss';
import QueueContext from '../../../../util/QueueContext';

/**
 * Component to display current matchup/champion
 *
 * @param {object} _props - components
 * @returns {string} html markup for view
 */
const MatchupView = (_props) => {
  const ctx = useContext(QueueContext);

  // console.log(ctx);

  return (
    <div className="Matchup">
      <div className="Champion">
        {!ctx.currentChampion && '👑 No Champion Yet!'}
        {ctx.currentChampion &&
          `👑: (${ctx.currentChampion.winStreak})
          ${ctx.currentChampion.user.displayName}`}
      </div>
      <div className="Challenger">
        {ctx.currentMatchup &&
        `⚔️: ${ctx.currentMatchup.challenger.displayName}`}
      </div>
    </div>
  );
};

export default MatchupView;
