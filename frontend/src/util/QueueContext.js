import { createContext } from 'react';

export default createContext({
  queue: null,
  currentMatchup: null,
  currentChampion: null,
  finishedLoading: false,
  shopState: { shopOpen: false, buttonX: 0, buttonY: 0 },
  leaderboardState: { leaderboardOpen: false, buttonX: 0, buttonY: 0 },
  auth: null,
});
