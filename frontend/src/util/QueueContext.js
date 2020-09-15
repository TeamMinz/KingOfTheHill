import {createContext} from 'react';

export default createContext({
  queue: null,
  matchup: null,
  finishedLoading: false,
  auth: null,
});
