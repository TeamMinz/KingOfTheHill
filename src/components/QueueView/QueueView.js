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
   *
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
            twitch.rig.log(bodyData);

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
            twitch.rig.log(bodyData);

            if (resp.ok) {
              setButtonAction(() => JoinQueue);
              setButtonText('Join the Queue');
            }
          });
        });
  };

  const QueueEffect = () => {
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);
      if (message.type == 'updateQueue') {
        setQueue(message.message);
      }
    }

    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        firstTimeSetup();
        setFinishedLoading(true);
      }
    }

    function firstTimeSetup() {
      fetchQueue();
      setButtonText('Join the queue!');
      setButtonAction(() => JoinQueue);
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

  const queueEntries = Queue ?
    Queue.map((opaqueId, index) => <li key={index}>{opaqueId}</li>) :
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
