import {createContext} from 'react';

export default createContext({
  queue: null,
  currentMatchup: null,
  currentChampion: null,
  finishedLoading: false,
  auth: null,
});
