import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './QueueView.css';
import Authentication from '../../util/Authentication/Authentication';
import MatchupView from '../MatchupView/MatchupView';
const QueueView = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  // state stuff
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Queue, setQueue] = useState([]);

  // helper functions
  /**
   * Fethches the current queue from the backend.
   */
  function fetchQueue() {
    authentication
        .makeCall('https://localhost:8081/queue/get', 'GET')
        .then((resp) => {
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

  const JoinQueue = () => {
    authentication
        .makeCall('https://localhost:8081/queue/join', 'POST')
        .then((resp) => {
          resp.json().then((bodyData) => {
            if (resp.ok) {
              setButtonText('Leave the Queue');
              setButtonAction(() => LeaveQueue);
            }
          });
        });
  };

  const LeaveQueue = () => {
    authentication
        .makeCall('https://localhost:8081/queue/leave', 'POST')
        .then((resp) => {
          resp.json().then((bodyData) => {
            if (resp.ok) {
              setButtonAction(() => JoinQueue);
              setButtonText('Join the Queue');
            }
          });
        });
  };

  const QueueEffect = () => {
    /**
     * @param _target
     * @param _contentType
     * @param body
     */
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);
      if (message.type == 'updateQueue') {
        setQueue(message.message);
      }
    }

    /**
     * @param auth
     */
    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        firstTimeSetup();
        setFinishedLoading(true);
      }
    }

    /**
     *
     */
    function firstTimeSetup() {
      fetchQueue();
    }

    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
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

  return (
    <div className="QueueView">
      <MatchupView />
      <hr />
      <div className="Queue">
        <ol>{queueEntries}</ol>
      </div>
      <hr />
      <div className="Join">
        <button className="QueueButton" onClick={ButtonAction}>
          {ButtonText}
        </button>
      </div>
    </div>
  );
};

export default QueueView;
