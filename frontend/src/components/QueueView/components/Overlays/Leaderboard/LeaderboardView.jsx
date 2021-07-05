import { useContext, useEffect } from 'react';
import QueueContext from '@util/QueueContext';

const LeaderboardView = () => {
  const ctx = useContext(QueueContext);

  useEffect(() => {
    if (!ctx.finishedLoading) return;

    ctx.auth
      .makeCall('/leaderboard')
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard state.');
        console.debug(err);
      });
  }, [ctx.finishedLoading]);

  return <div />;
};

export default LeaderboardView;
