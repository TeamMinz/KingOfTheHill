import React, { useState, useEffect } from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import PropTypes from 'prop-types';
import QueueNotification from '@components/QueueNotification/QueueNotification';
import QueueView from '@components/QueueView/QueueView';
import Authentication from '@util/Authentication/Authentication';
import { StyledQueuePanel, StyledApp } from './App.style';

/**
 * Base class for the React App. Sets up the scene
 */
const App = ({ format }) => {
  const [IsVisible, setVisible] = useState(true);
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Theme, setTheme] = useState('dark');

  const authentication = new Authentication();

  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    if (twitch) {
      twitch.onError((err) => {
        console.log('Error', err);
      });

      twitch.onVisibilityChanged((isVisible) => {
        setVisible(isVisible);
      });

      twitch.onContext((context, delta) => {
        if (delta.includes('theme')) {
          setTheme(context.theme);
        }
      });

      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          setFinishedLoading(true);
        }
      });
    }
  });

  if (FinishedLoading && IsVisible) {
    return (
      <StyledApp format={format} theme={Theme}>
        <QueueNotification />
        <QueueView />
      </StyledApp>
    );
  }
  return null;
};

App.propTypes = {
  format: PropTypes.oneOf(['mobile', 'panel', 'component']).isRequired,
};

export default App;
