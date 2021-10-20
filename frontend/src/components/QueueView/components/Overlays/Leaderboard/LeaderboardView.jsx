import React, { useContext, useEffect, useState } from 'react';
import QueueContext from '@util/QueueContext';
import {
  StyledLeaderboardContainer,
  StyledLeaderboardEntry,
  EntryIndex,
  EntryName,
  EntryScore,
} from './Leaderboard.stye';

const LeaderboardView = () => {
  const ctx = useContext(QueueContext);

  const [LeaderboardList, setLeaderboardList] = useState([]);

  const updateLeaderboard = () => ctx.auth
    .makeCall('/leaderboard/')
    .then((resp) => resp.json())
    .then((json) => setLeaderboardList(json))
    .catch(() => {
      /* silently ignore error */
    });

  useEffect(() => {
    if (!ctx.finishedLoading) return;
    updateLeaderboard();
  }, [ctx.finishedLoading]);

  useEffect(() => {
    if (!ctx.leaderboardState.leaderboardOpen) return;
    updateLeaderboard();
  }, [ctx.leaderboardState.leaderboardOpen]);

  const leaderboardEntries = LeaderboardList.map((entry, index) => (
    <StyledLeaderboardEntry key={entry.userId}>
      <EntryIndex>
        {index + 1}
        .
      </EntryIndex>
      <EntryName>{entry.displayName}</EntryName>
      <EntryScore>
        {`${entry.score.toString()} `}
        {index === 0 && '🥇'}
        {index === 1 && '🥈'}
        {index === 2 && '🥉'}
        {index > 2 && '👑'}
      </EntryScore>
    </StyledLeaderboardEntry>
  ));

  return <StyledLeaderboardContainer>{leaderboardEntries}</StyledLeaderboardContainer>;
};

export default LeaderboardView;
