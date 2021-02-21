import React, {useState, useEffect, useRef} from 'react';
import '../App/App.css';
import './QueueView.css';
import MatchupView from './components/MatchupView/MatchupView';
import QueueComponent from './components/QueueComponent/QueueComponent';
import QueueContext from '../../util/QueueContext';
import Authentication from '../../util/Authentication/Authentication';

/**
 * Component to Queue Tab
 *
 * @param {object} _props - components
 * @returns {string} html markup for view
 */
const QueueView = (_props) => {
  // Twitch & Authentication stuff.
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authProp = useRef(new Authentication());
  const authentication = authProp.current;

  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Queue, setQueue] = useState(null);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);
  const [CurrentChampion, setCurrentChampion] = useState(null);

  /**
   * Fetches a bunch of info from the backend,
   * and stores it for components to use.
   */
  const firstTimeSetup = () => {
    // Update the queue.
    authentication.makeCall('/queue/get', 'GET').then(function(resp) {
      if (resp.ok) {
        resp.json().then((queue) => {
          console.log(queue);
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

    authentication.makeCall('/champion/get').then((resp) => {
      if (resp.ok) {
        resp.json().then((resp) => {
          if (resp) {
            setCurrentChampion(resp);
          } else {
            setCurrentChampion(null);
          }
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

      // console.log(message);

      if (message.type == 'updateQueue') {
        setQueue(message.message);
      } else if (message.type == 'updateMatchup') {
        setCurrentMatchup(message.message);
      } else if (message.type == 'updateChampion') {
        if (message.message) {
          setCurrentChampion(message.message);
        } else {
          setCurrentChampion(null);
        }
      }
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  }, [FinishedLoading]);

  return (
    <div className="QueueView">
      <QueueContext.Provider
        value={{
          queue: Queue,
          currentMatchup: CurrentMatchup,
          finishedLoading: FinishedLoading,
          currentChampion: CurrentChampion,
          auth: authentication,
        }}
      >
        <MatchupView />
        <QueueComponent />
      </QueueContext.Provider>
    </div>
  );
};

export default QueueView;
