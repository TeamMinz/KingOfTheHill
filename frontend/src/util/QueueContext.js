import {createContext} from 'react';

export default createContext({
  queue: null,
  currentMatchup: null,
  finishedLoading: false,
  auth: null,
});
