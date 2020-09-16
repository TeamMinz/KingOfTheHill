import React, {useState, useEffect, useRef} from 'react';

// eslint-disable-next-line max-len
import SelectedMessageForm from './components/SelectedMessageForm/SelectedMessageForm';
// eslint-disable-next-line max-len
import MatchupController from './components/MatchupController/MatchupController';
import QueueController from './components/QueueController/QueueController';
import RejoinController from './components/RejoinController/RejoinController';
import QueueContext from '../../util/QueueContext';
import Authentication from '../../util/Authentication/Authentication';

import '../App/App.css';
import './LiveConfigPage.css';

/**
 * Live config page react hook.
 *
 * @param {*} props properties of the live config page.
 * @returns {any} the html to be rendered.
 */
const LiveConfigPage = (props) => {
  // Twitch & Authentication stuff.
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authProp = useRef(new Authentication());
  const authentication = authProp.current;

  // State stuff.
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Theme, setTheme] = useState('light');
  const [Queue, setQueue] = useState(null);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);

  /**
   * Fetches a bunch of info from the backend,
   * and stores it for components to use.
   */
  const firstTimeSetup = () => {
    // Update the queue.
    authentication.makeCall('/queue/get', 'GET').then(function(resp) {
      if (resp.ok) {
        resp.json().then((queue) => {
          setQueue(queue);
        });
      }
    });

    // Update the current matchup.
    authentication.makeCall('/matchup/current/get').then((resp) => {
      if (resp.ok) {
        resp.json().then((resp) => {
          setCurrentMatchup(resp.matchup);
        });
      } else {
        // TODO: add logging.
      }
    });
  };

  // Initialize authentication & twitch stuff.
  useEffect(() => {
    if (twitch) {
      twitch.onError((err) => {
        console.log('Error', err);
      });

      // Authentication setup
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!FinishedLoading) {
          firstTimeSetup();

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

  useEffect(() => {
    /**
     * Handles pubsub messages
     *
     * @param {string} _target target
     * @param {string} _contentType content type
     * @param {object} body message body passed by twitch api.
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);

      console.log(message);

      if (message.type == 'updateQueue') {
        setQueue(message.message);
      } else if (message.type == 'updateMatchup') {
        setCurrentMatchup(message.message);
      }
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  }, [FinishedLoading]);

  if (FinishedLoading) {
    return (
      <div
        // eslint-disable-next-line max-len
        className={`LiveConfigPage ${
          Theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'
        }`}
      >
        <QueueContext.Provider value={{
          queue: Queue,
          currentMatchup: CurrentMatchup,
          finishedLoading: FinishedLoading,
          auth: authentication,
        }}>
          <SelectedMessageForm />
          <MatchupController />
          <RejoinController />
          <QueueController />
        </QueueContext.Provider>
      </div>
    );
  } else {
    return <div className="LiveConfigPage"> Not authenticated yet</div>;
  }
};

export default LiveConfigPage;
