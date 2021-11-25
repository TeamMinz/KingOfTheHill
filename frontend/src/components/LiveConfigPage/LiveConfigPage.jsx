import React, { useState, useEffect, useRef, useMemo } from 'react';
import SelectedMessageForm from './components/SelectedMessageForm/SelectedMessageForm';
import MatchupController from './components/MatchupController/MatchupController';
import QueueController from './components/QueueController/QueueController';
import RejoinController from './components/RejoinController/RejoinController';
import QueueContext from '../../util/QueueContext';
import Authentication from '../../util/Authentication/Authentication';
import LeaderboardController from './components/LeaderboardController/LeaderboardController';
import WatchdogController from './components/WatchdogController/WatchdogController';
import { StyledLiveConfigPage } from './LiveConfigPage.style';

/**
 * Live config page react hook.
 *
 * @returns {any} the html to be rendered.
 */
const LiveConfigPage = () => {
  // Twitch & Authentication stuff.
  const authProp = useRef(new Authentication());
  const authentication = authProp.current;

  // State stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Theme, setTheme] = useState('light');
  const [Queue, setQueue] = useState(null);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [ConfigSettings, setConfigSettings] = useState({});

  // Lets bundle some of these together to pass to our subelements.
  const ctx = useMemo(() => ({
    queue: Queue,
    currentMatchup: CurrentMatchup,
    finishedLoading: FinishedLoading,
    auth: authentication,
  }), [Queue, CurrentMatchup, FinishedLoading, authentication]);

  /**
   * Fetches a bunch of info from the backend,
   * and stores it for components to use.
   */
  const firstTimeSetup = (twitch) => {
    // Update the queue.
    authentication.makeCall('/queue/get', 'GET').then((resp) => {
      if (resp.ok) {
        resp.json().then((queue) => {
          setQueue(queue);
        });
      }
    });

    // Update the current matchup.
    authentication.makeCall('/matchup/current/get').then((resp) => {
      if (resp.ok) {
        resp.json().then((jsonResp) => {
          setCurrentMatchup(jsonResp.matchup);
        });
      } else {
        // TODO: add logging.
      }
    });

    // Pull our config settings from twitch config service.
    if (twitch.configuration.broadcaster && twitch.configuration.broadcaster.version === '1.0.0') {
      try {
        const config = JSON.parse(twitch.configuration.broadcaster.content);
        setConfigSettings(config);
      } catch (e) {
        twitch.rig.log(e);
      }
    }
  };

  // Initialize authentication & twitch stuff.
  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    if (twitch) {
      twitch.onError((err) => {
        twitch.rig.log('Error', err);
      });

      // Authentication setup
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          firstTimeSetup(twitch);

          setFinishedLoading(true);
        }
      });

      // Handle light / dark mode
      twitch.onContext((context, delta) => {
        if (delta.includes('theme')) {
          setTheme(context.theme);
        }
      });
    }
  });

  // Updates queue and stuff when we get appt pubsub messages and such.
  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    /**
     * Handles pubsub messages
     *
     * @param {string} _target target
     * @param {string} _contentType content type
     * @param {object} body message body passed by twitch api.
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);

      if (message.type === 'updateQueue') {
        setQueue(message.message);
      } else if (message.type === 'updateMatchup') {
        setCurrentMatchup(message.message);
      }
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
    return false;
  }, [FinishedLoading]);

  // Updates the twitch configuration settings when our ConfigSettings change.
  useEffect(() => {
    const twitch = window.Twitch ? window.Twitch.ext : null;
    // Checking if config settings is either falsy or an empty object.
    if (FinishedLoading && ConfigSettings && Object.keys(ConfigSettings).length) {
      twitch.rig.log('Saving live config');
      twitch.rig.log(JSON.stringify(ConfigSettings));

      twitch.configuration.set(
        'broadcaster',
        '1.0.0',
        JSON.stringify(ConfigSettings),
      );
    }
  }, [ConfigSettings, FinishedLoading]);

  /**
   * @param {object} rejoinSettings settings object for rejoin settings.
   */
  const setRejoinSettings = (rejoinSettings) => {
    setConfigSettings((prevState) => {
      const config = { ...prevState };
      config.rejoinSettings = rejoinSettings;
      return config;
    });
  };

  /**
   * @param {object} watchdogSettings settings object for the watchdog settings.
   */
  const setWatchdogSettings = (watchdogSettings) => {
    setConfigSettings((prevState) => {
      const config = { ...prevState };
      config.watchdogSettings = watchdogSettings;
      return config;
    });
  };

  if (FinishedLoading) {
    return (
      <StyledLiveConfigPage theme={Theme}>
        <QueueContext.Provider
          value={ctx}
        >
          <SelectedMessageForm />
          <MatchupController />
          <RejoinController settings={ConfigSettings} onChange={setRejoinSettings} />
          <WatchdogController settings={ConfigSettings} onChange={setWatchdogSettings} />
          <QueueController />
          <LeaderboardController />
        </QueueContext.Provider>
      </StyledLiveConfigPage>
    );
  }
  return <StyledLiveConfigPage>Not authenticated yet</StyledLiveConfigPage>;
};

export default LiveConfigPage;
