import { useContext, useEffect } from 'react';
import QueueContext from '@util/QueueContext';

const LeaderboardView = () => {
  const ctx = useContext(QueueContext);

  useEffect(() => {
    if (!ctx.finishedLoading) return;

    ctx.auth
      .makeCall('/leaderboard/')
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard state.');
        console.log(err);
      });
  }, [ctx.finishedLoading]);

  return <div />;
};

export default LeaderboardView;
