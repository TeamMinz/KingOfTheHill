import React, {useState, useEffect} from 'react';
import '../App/App.css';
import './QueueView.css';
import Authentication from '../../util/Authentication/Authentication';

const QueueView = (_props) => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const authentication = new Authentication();

  // state stuff
  const [ButtonText, setButtonText] = useState('Loading...');
  const [ButtonAction, setButtonAction] = useState(() => {});
  const [FinishedLoading, setFinishedLoading] = useState(false);
  const [Queue, setQueue] = useState([]);
  const [CurrentMatchup, setCurrentMatchup] = useState(null);

  // helper functions
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
  };

  function fetchMatchup() {
    authentication
        .makeCall('https://localhost:8081/matchup/current/get')
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((resp) => {
              setCurrentMatchup(resp.matchup);
            });
          }
        });
  };

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
    };

    function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        firstTimeSetup();
        setFinishedLoading(true);
      }
    }

    function firstTimeSetup() {
      fetchQueue();
      fetchMatchup();
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

  const MatchupEffect = () => {
    function handleMessage(_target, _contentType, body) {
      const message = JSON.parse(body);
      if (message.type == 'updateMatchup') {
        setCurrentMatchup(message.message);
      }
    };

    /* function handleAuthentication(auth) {
      authentication.setToken(auth.token, auth.userId);

      if (!FinishedLoading) {
        setFinishedLoading(true);
      }
    }


    if (twitch) {
      twitch.onAuthorized(handleAuthentication);
    } */ // this is all stuff that we will need when we move this code file

    if (FinishedLoading) {
      twitch.listen('broadcast', handleMessage);

      return function cleanup() {
        twitch.unlisten('broadcast', handleMessage);
      };
    }
  };

  // called when the component mounts.
  useEffect(QueueEffect, [Queue, FinishedLoading]);
  useEffect(MatchupEffect, [CurrentMatchup, FinishedLoading]);


  const queueEntries = Queue?
    Queue.map((opaqueId, index) => (<li key={index}>{opaqueId}</li>)):
    [];

  let headerDiv = null;

  // TODO: we should move this current matchup stuff out of this file.
  if (CurrentMatchup) {
    headerDiv = (
      <div className="Champion">
        Now Playing: 👑 {CurrentMatchup.champion} (27) v{' '}
        {CurrentMatchup.challenger}
      </div>
    );
  } else {
    headerDiv = <div className="Champion">👑 TMinz - 27 wins</div>;
  }

  return (
    <div className="QueueView">
      {headerDiv}
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
