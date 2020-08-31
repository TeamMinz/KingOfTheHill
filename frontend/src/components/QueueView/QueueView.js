import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './QueueView.css';
import Authentication from '../../util/Authentication/Authentication';
import MatchupView from '../MatchupView/MatchupView';

/**
 * Component to Queue Tab
 *
 * @param {object} _props - components
 * @returns {string} html markup for view
 */
const QueueView = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  // state stuff
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Queue, setQueue] = useState([]);
  const [opaqueUserId, setOpaqueID] = useState(null);
  const [UserId, setUserID] = useState(null);

  // helper functions
  /**
   * Fethches the current queue from the backend.
   */
  function fetchQueue() {
    authentication.makeCall('/queue/get', 'GET').then((resp) => {
      if (resp.ok) {
        resp.json().then((bodyData) => {
          const queue = bodyData.queue;

          if (queue.includes(authentication.getOpaqueId())) {
            setButtonText('Leave the Queue');
            setButtonAction(() => LeaveQueue);
          }

          setQueue(queue);
        });
      }
    });
  }

  /**
   * Adds the User to the Queue
   */
  const JoinQueue = () => {
    authentication.makeCall('/queue/join', 'POST').then((resp) => {
      resp.json().then((bodyData) => {
        if (resp.ok) {
          setButtonText('Leave the Queue');
          setButtonAction(() => LeaveQueue);
        }
      });
    });
  };

  /**
   * Removes the User from the Queue
   */
  const LeaveQueue = () => {
    authentication.makeCall('/queue/leave', 'POST').then((resp) => {
      resp.json().then((bodyData) => {
        if (resp.ok) {
          setButtonAction(() => JoinQueue);
          setButtonText('Join the Queue');
        }
      });
    });
  };

  /**
   * Custom Effect for QueueView
   * Handles Twitch authentication and pubsubs
   *
   * @returns {Function} closing function to stop listening to twitch broadcasts
   */
  const QueueEffect = () => {
    /**
     * Handles pubsub messages for 'updateQueue'
     *
     * @param {string} _target target
     * @param {string} _contentType content type
     * @param {object} body message body passed by twitch api.
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);
      if (message.type == 'updateQueue') {
        setQueue(message.message);
      }
    }

    /**
     * Handles authorizing with twitch and running first time setup
     *
     * @param {object} auth - twitch authentication information
     */
    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        firstTimeSetup();
        setFinishedLoading(true);
      }
    }

    /**
     * Sets the Users Opaque and User ID
     */
    function firstTimeSetup() {
      setOpaqueID(authentication.getOpaqueId());
      setUserID(authentication.getUserId());
      fetchQueue();
    }

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
      twitch.onVisibilityChanged((isVisible, context) => {
        if (isVisible) {
          twitch.listen('broadcast', handleMessage);
        }
      });
    }

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  };

  // called when the component mounts.
  useEffect(QueueEffect, [Queue, FinishedLoading]);

  // Controls the join / leave button
  useEffect(() => {
    if (FinishedLoading) {
      if (
        Queue.findIndex(
            (challenger) =>
              challenger.opaqueUserId == authentication.getOpaqueId(),
        ) == -1
      ) {
        setButtonAction(() => JoinQueue);
        setButtonText('Join the Queue');
      } else {
        setButtonAction(() => LeaveQueue);
        setButtonText('Leave the Queue');
      }
    }
  }, [Queue]);

  const queueEntries = Queue ?
    Queue.map((challenger, index) => (
      <li key={index}>{challenger.displayName}</li>
    )) :
    [];

  const userEntry = Queue ?
    Queue.findIndex((challenger) => {
      return challenger.opaqueUserId == opaqueUserId;
    }) :
    -1;

  return (
    <div className="QueueView">
      <MatchupView />
      <div className="Queue">
        {queueEntries && queueEntries.length > 0 && (
          <div>
            <ol>{queueEntries.slice(0, 5)}</ol>
            {userEntry > 4 && (
              <div>
                ...
                <br />
                <ol start={userEntry + 1}>
                  <li key={userEntry}>{Queue[userEntry].displayName}</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="Join">
        <button
          className="QueueButton"
          onClick={ButtonAction}
          disabled={!UserId}
        >
          {ButtonText}
        </button>
      </div>
    </div>
  );
};

export default QueueView;
